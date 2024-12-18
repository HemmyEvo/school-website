'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';

type Props = {};

const AboutMe = (props: Props) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-10">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Heading Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">About Me</h1>
          <p className="text-xl text-gray-600">Empowering the Future with Technology</p>
        </header>

        {/* Main Content */}
        <section className="space-y-12">
          {/* Opay Donation Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 font-semibold">Support My Journey</p>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              If you find value in my work and would like to contribute to my development, I invite you to send donations to my Opay account:
              <span className="font-semibold text-blue-600"> 7010331943</span>.
            </p>
            <p className="text-sm text-gray-600">
              Your support allows me to continue learning, growing, and creating impactful solutions in the tech industry. I appreciate your contribution to my journey.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 font-semibold">Let&rsquo;s Connect</p>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              I&rsquo;m always open to conversations, collaborations, or simply sharing ideas. If you&apos;d like to reach out, you can contact me directly on WhatsApp:
              <Link href="https://wa.link/endaa" target="_blank" className="text-blue-600 underline hover:text-blue-800">
                WhatsApp Me
              </Link>
            </p>
          </div>

          {/* About Me Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 font-semibold">Who Am I?</p>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Hi, I&apos;m Emmanuel, a Full-Stack Developer and the founder of Hemmyevo. I&apos;m passionate about technology and problem-solving. My journey as a developer started with a fascination for coding and grew into a mission to create technology solutions that can change the world.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              As a student, I balance my academic pursuits with my work as a developer. My role as a Full-Stack Developer allows me to engage with both the front-end and back-end of applications, ensuring efficient and scalable solutions that meet user needs.
            </p>
            <p className="text-sm text-gray-600">
              I strive for continuous improvement and learning, always looking for ways to better my craft and contribute to meaningful projects.
            </p>
          </div>

          {/* Hobbies Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 font-semibold">My Interests</p>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              When I&rsquo;m not coding, you&rsquo;ll likely find me solving puzzles or exploring new technologies. I&rsquo;m passionate about learning and constantly seek ways to expand my knowledge, both professionally and personally.
            </p>
            <p className="text-sm text-gray-600">
              I believe in growth, and I&rsquo;m always striving to improve myself while building solutions that have a positive impact on society.
            </p>
          </div>

          {/* Final Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 font-semibold">Supporting My Work</p>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              If you want to support my growth and help me further my work in technology, I greatly appreciate your contribution. Your support allows me to continue developing new skills, building projects, and pursuing my passion for tech innovation.
            </p>
            <p className="text-sm text-gray-600">
              Every contribution, no matter how small, makes a difference in helping me achieve my goals. Thank you for your generosity.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutMe;
