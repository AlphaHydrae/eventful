
require 'rake'

DEPS = {
  'jshint' => 'hint',
  'uglify-js' => 'uglifyjs',
  'vows' => 'vows'
}

ROOT = File.expand_path File.dirname(__FILE__)
SRC = File.join ROOT, 'src'

def script_path dep
  File.join ROOT, 'node_modules', dep, 'bin', DEPS[dep]
end

def get_version
  raise 'VERSION file is missing.' unless File.exists? File.join(ROOT, 'VERSION')
  version = File.open(File.join(ROOT, 'VERSION'), 'r').read.chomp
  raise 'VERSION file is corrupted.' unless version.match /^\d\.\d\.\d$/
  parts = version.split /\./
  {
    :major => parts[0].to_i,
    :minor => parts[1].to_i,
    :patch => parts[2].to_i
  }
end

def make_version h
  "#{h[:major]}.#{h[:minor]}.#{h[:patch]}"
end

def save_version version
  File.open(File.join(ROOT, 'VERSION'), 'w'){ |f| f.write version }
end

def bump type
  version = get_version
  old_version = make_version version
  new_version = make_version version.tap{ |v| v[type] += 1 }
  save_version new_version
  puts "Version bumped from #{old_version} to #{new_version}."
end

desc 'Copy version to sources, run test suite, validate and compress javascript.'
task :build => [ :spec, :check, :copy_version_to_sources, :minify ]

desc 'Validate javascript.'
task :check => [ :validate_presence_of_deps ] do |t|
  result = system %/#{script_path 'jshint'} "#{File.join SRC, 'eventful.js'}"/
  fail 'Javascript has errors.' unless result
end

desc 'Compress javascript.'
task :minify => [ :validate_presence_of_deps ] do |t|
  result = system %/#{script_path 'uglify-js'} -o "#{File.join SRC, 'eventful.min.js'}" "#{File.join SRC, 'eventful.js'}"/
  fail 'Could not compress javascript.' unless result
end

desc 'Run test suite.'
task :spec => [ :validate_presence_of_deps ] do |t|
  result = system %/#{script_path 'vows'} --spec #{File.join ROOT, 'spec', '*'}/
  fail 'Test suite failed.' unless result
end

namespace :version do

  task :show do |t|
    puts make_version(get_version)
  end

  namespace :bump do

    desc 'Bump the major version by 1.'
    task :major do |t|
      bump :major
    end

    desc 'Bump the minor version by 1.'
    task :minor do |t|
      bump :minor
    end

    desc 'Bump the patch version by 1.'
    task :patch do |t|
      bump :patch
    end
  end
end

desc 'Show the current version.'
task :version => [ 'version:show' ]

task :copy_version_to_sources do |t|

  src_file = File.join(SRC, 'eventful.js')
  src = File.open(src_file, 'r').read
  result = src.sub!(/ \* eventful v[\d\.]+/, " * eventful v#{make_version(get_version)}")
  raise 'Could not find version in source file.' unless result

  pkg_file = File.join ROOT, 'package.json'
  pkg = File.open(pkg_file, 'r').read
  result = pkg.sub!(/\"version\"\: \"[\d\.]+\"/, %/"version": "#{make_version(get_version)}"/)
  raise 'Could not find version in package file.' unless result

  File.open(src_file, 'w'){ |f| f.write src }
  File.open(pkg_file, 'w'){ |f| f.write pkg }
end

task :validate_presence_of_deps do |t|
  DEPS.each_key do |dep|
    bin_path = script_path dep
    raise "Missing binary #{bin_path}. Run 'npm install'." unless File.exists? bin_path
  end
end
