#!/usr/bin/env ruby
require 'xcodeproj'
xcproj = Xcodeproj::Project.open(ENV["xcodeProj"])
xcproj.recreate_user_schemes
xcproj.save
