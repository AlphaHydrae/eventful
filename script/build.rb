#!/usr/bin/env ruby

root = File.expand_path('..', File.dirname(__FILE__))
yui = File.join root, 'script', 'yuicompressor-2.4.7.jar'

original = File.join root, 'src', 'eventful.js'
minified = File.join root, 'src', 'eventful.min.js'

`java -jar #{yui} -o "#{minified}" "#{original}"`
