<?php

namespace Bolt\Extension\TwoKings\GoogleMaps;

use Bolt\Extensions\Snippets\Location as SnippetLocation;

class Extension extends \Bolt\BaseExtension
{

    function info() {

        $data = array(
            'name' =>"Google Map",
            'description' => "",
            'author' => "Xiao-Hu Tai",
            'link' => "http://bolt.cm",
            'version' => "1.2",
            'required_bolt_version' => "1.0",
            'highest_bolt_version' => "1.0",
            'type' => "Twig function",
            'first_releasedate' => "2013-12-09",
            'latest_releasedate' => "2015-02-03",
        );

        return $data;

    }

    function initialize() {

        // Set up routing for the extension.
        $path     = $this->app['config']->get('general/branding/path');

        $this->app->match($path . '/googlemap/json' , array($this, 'getJson'));
        $this->addTwigFunction('googlemap', 'googlemap');

    }

    /**
     * Use {{ googlemap("example") }} in your .twig templates.
     */
    function googlemap($name = null) {

        // Script files inserted only when googlemap is called in templates.
        // Multiple calls will still work, because that's how Bolt works.
        $this->insertSnippets();

        $verbose = $this->config['verbose'];

        if (empty($name)) {
            return $verbose ? "GoogleMap: parameter name is not defined." : false;
        }
        if (empty($this->config[$name])) {
            return $verbose ? "GoogleMap: $name is undefined." : false;
        }

        $data = $this->config[$name];

        if ($data['js']) {
            $this->insertJavascript( '/extensions/local/twokings/googlemaps/assets/' . $data['js'] ); // todo: bolt2 assets
        }

        if ($data['css']) {
            $this->insertCss( '/extensions/local/twokings/googlemaps/assets/' . $data['css']); // todo: bolt2 assets
        }

        echo '<div id="'.$name.'"></div>'; // otherwise use {{ ...|raw }}
        return;

    }

    function getJson() {

        $data = array();
        $name = $this->app['request']->get('name', null);

        if (empty($name) || empty($this->config[$name])) {
            return $this->app->json($data, 201);
        }

        // TODO - get contenttypes with the geo locations
        $options         = $this->config[$name];
        $contenttypes    = $options['contenttypes'];
        $allContenttypes = $this->app['config']->get('contenttypes');
        $tablePrefix     = $this->app['config']->get('general/database/prefix', 'bolt_');

        foreach ($contenttypes as $contenttype => $geoproperty) {
            // Query all objects of contenttype
            if (isset($allContenttypes[$contenttype]['slug'])) {
                $contenttypeslug = $allContenttypes[$contenttype]['slug'];

                // $tableName = $tablePrefix . $contenttypeslug;
                // $query     = sprintf("SELECT * FROM %s WHERE status='%s'", $tableName, 'published');
                // $results   = $this->app['db']->fetchAll($query);

                $results = $this->app['storage']->getContent($contenttypeslug, array('status' => 'published'));

                foreach ($results as $result) {
                    $related = array();

                    if ($result->relation && isset($result->relation['deelnemers'])) {
                        $relatedrecords = $result->related();
                        foreach ($relatedrecords as $record) {
                            $related[$record->contenttype['slug']][] = $record->values;
                        }
                    }
                    if (isset($result->values[$geoproperty]) && !empty($result->values[$geoproperty])) {
                        $geodata = $result->values[$geoproperty];
                        $result->values['relations'] = $related; // add the relations, a bit hack-ish tho

                        // $result[$geoproperty] = $geodata; // 20140326: fix so that you can read geolocation fields in json

                        $data[] = array(
                            "lat" => (float)$geodata['latitude'],
                            "lng" => (float)$geodata['longitude'],
                            $geoproperty => $geodata,
                            "data" => $result->values // TODO may be too much data, we need to define somewhere what data gets used!
                        );
                    } elseif ($this->config['verbose']) {
                        echo '/*-- Field '.$geolocation.' for '.$contenttype.' is not defined. --*/';
                    }
                }


            } elseif ($this->config['verbose']) {
                echo '/*-- Contenttype '.$contenttype.' is not defined. --*/';
            }

            // Get geoproperty and publish them as "lat" and "lng"
            // The rest of the properties go into "data"

        }

        // return json_encode($data);
        return $this->app->json($data, 201);

    }

    protected function insertJavascript( $name ) {
        $this->addSnippet(SnippetLocation::END_OF_BODY, '<script src="'. $name .'"></script>');
    }

    protected function insertCss( $name ) {
        $this->addSnippet(SnippetLocation::AFTER_CSS, '<link rel="stylesheet" href="'. $name .'" />');
    }

    private function insertSnippets() {

        if ( isset($this->config['add_googlemaps']) && $this->config['add_googlemaps'] ) {
            $this->app['extensions']->addJavascript($this->config['googlemaps']);
        }

        if ( isset($this->config['add_jquery']) && $this->config['add_jquery'] ) {
            $this->app['extensions']->addJavascript($this->config['jquery']);
        }

        if ( isset($this->config['add_gmap3']) && $this->config['add_gmap3'] ) {
            // We need to add this add the end of body, because Bolt's jQuery is added at the end of body.
            // $this->app['extensions']->addJavascript( $app_url . $this->config['gmap3'] );
            $this->addSnippet(SnippetLocation::END_OF_BODY, '<script src="'. $this->config['gmap3'].'"></script>'); // todo: bolt2 assets
        }
    }

}
