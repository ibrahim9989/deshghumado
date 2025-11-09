'use client';

import { Globe, Heart, Users, Camera, MapPin, Award } from 'lucide-react';
import Image from 'next/image';

export default function AboutSection() {
  const stats = [
    { icon: Globe, number: '80+', label: 'Countries Explored' },
    { icon: Camera, number: '849K+', label: 'YouTube Subscribers' },
    { icon: Users, number: '1000+', label: 'Happy Travelers' },
    { icon: Award, number: '5+', label: 'Years of Experience' },
  ];

  const adventureHighlights = [
    {
      title: 'Syria',
      description: 'Explored war-torn regions with authentic local experiences',
      image: 'https://i.pinimg.com/736x/2c/4d/dc/2c4ddc0d5026112d95ad75d5f222e469.jpg',
    },
    {
      title: 'Somalia',
      description: 'Ventured into one of the world\'s most challenging destinations',
      image: 'https://i.pinimg.com/736x/73/59/d3/7359d38523c23ad46eecefb8e4bd5b53.jpg',
    },
    {
      title: 'Haiti',
      description: 'Discovered hidden beauty in misunderstood places',
      image: 'https://haitiwonderland.com/assets/images/upload/section/haiti_1757524952.webp',
    },
    {
      title: 'Papua New Guinea',
      description: 'Immersed in remote tribal cultures and pristine nature',
      image: 'https://lh3.googleusercontent.com/proxy/X13ES5rtbaCJxPQchA7g0NJtoCs8yvKH54a7cUZX5-YMcS9ON2676reKPDp4SMZm6i0CY4fcLGCizQe90DO8S1mWcJ5zi_3wvkw',
    },
  ];

  return (
    <section id="about" className="py-20 px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://yt3.googleusercontent.com/XkAvPwKysWsRyfC5OxUOSZFutUwciDVurFFV6RCgjoUzsr6Rcul_hr4NDJat28mp82y3yr-TWg=s900-c-k-c0x00ffffff-no-rj"
                alt="Vishnu Saha - The Wandering Maniac"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Vishnu Saha</h3>
                <p className="text-xl text-pink-300">Wandering Maniac</p>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl">
              <p className="text-4xl font-bold">80+</p>
              <p className="text-sm">Countries</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Created by a Traveller,{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                for Travellers
              </span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              DeshGhumado was founded by <strong>Vishnu Saha</strong>, a world globetrotter who has journeyed 
              across <strong>80+ countries</strong>, exploring some of the most remote and fascinating corners 
              of the planet.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              What started as a passion for immersive travel turned into a mission — to create life-changing 
              travel experiences that go far beyond the usual tourist trails.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At DeshGhumado, we believe travel should be <strong>raw, real, and unforgettable</strong>. 
              Our group tours are personally curated and led by Vishnu himself, ensuring every journey 
              captures the soul of a destination.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              From hidden villages and offbeat cultures to authentic local encounters, we take you where 
              normal tour companies don't.
            </p>

            {/* CTA Button */}
            <div>
              <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                Watch Vishnu's Journey
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <p className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Adventure Highlights */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">
              Adventures Beyond the{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Ordinary
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vishnu has explored some of the world's most challenging and misunderstood destinations, 
              bringing raw and authentic stories from places others fear to go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adventureHighlights.map((adventure, index) => (
              <div
                key={index}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <Image
                  src={adventure.image}
                  alt={adventure.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">{adventure.title}</h4>
                  <p className="text-sm text-gray-200">{adventure.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Our Travel Philosophy
            </h3>
            <p className="text-xl mb-6 leading-relaxed">
              Each DeshGhumado trip is designed to help you connect — not just with new places, 
              but with stories, people, and moments that stay with you for a lifetime.
            </p>
            <p className="text-xl leading-relaxed">
              Join us, and experience the world the way a true traveller does — 
              <strong> beyond the guidebooks, beyond the ordinary.</strong>
            </p>
          </div>
        </div>

        {/* Travel Approach */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-4">Cultural Immersion</h4>
            <p className="text-gray-600">
              Stay with locals, use public transport, and experience authentic cultures firsthand
            </p>
          </div>

          <div className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-4">Offbeat Destinations</h4>
            <p className="text-gray-600">
              Explore hidden gems and remote locations that most tourists never discover
            </p>
          </div>

          <div className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-4">Raw & Real Content</h4>
            <p className="text-gray-600">
              Unfiltered experiences that show the true essence of every destination
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

