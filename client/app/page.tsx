"use client";


import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { useGlobalContext } from "@/context/globalContext";
import { BriefcaseIcon, Building, CheckCircleIcon, SearchIcon, User } from "lucide-react";
import Link from "next/link";

export default function Home() {

  const features = [
    {
    icon: <BriefcaseIcon className="w-6 h-6 text-[#7263f3]" />,
    title: "Diverse Opportunities",
    description: "Explore a wide range of job listings across various industries and locations.",
    benefits: [
      '100+ job categories',
      '1000000+ job listings',
      'Remote and on-site options',
      'Daily job alerts',
      'Personalized job recommendations',
    ],
    cta: 'Explore Jobs',
    ctaLink: '/findwork',
  },
  {
    icon: <Building className="w-6 h-6 text-[#7263f3]" />,
    title: "Top Companies",
    description: "Explore a wide range of job listings across various industries and locations.",
    benefits: [
      '1000+ verified employers',
      'Exclusive partnerships',
      'Company reviews and ratings',
    ],
    cta: 'View Companies',
    ctaLink: '/findwork',
  },
  {
    icon: <User className="w-6 h-6 text-[#7263f3]" />,
    title: "Talent Pool",
    description: "Explore a wide range of job listings across various industries and locations.",
    benefits: [
      'AI-powered matching',
      'Resume optimization tools',
      '1M+ registered job seekers',
    ],
    cta: 'Post a Job',
    ctaLink: '/post',
  }
];
// const {isAuthenticated} = useGlobalContext();

// console.log("isAuthenticated", isAuthenticated);

  return (
    <div>
      <Header />

      <section className="py-20 bg-gradient-to-b from-[#d7dedc] to-[#7263f3]/5 text-primary-foreground">
        <div className="container mx-auto px-4 text-center text-black">
          <h1 className="text-4xl text-[#7263f3] md:text-5xl font-bold mb-6">
            Find Your Dream Job with <span className="text-[#7263f3]">JobFinder</span>
          </h1>
          <p className="text-xl mb-8">
            Discover the best job opportunities tailored just for you.
          </p>
          <div className="max-w-2xl mx-auto flex gap-4">
            <Input type='text' placeholder="Job title" className="flex-grow bg-white text-black" />
            <Button className="bg-[#7263f3] text-white"> 
              <SearchIcon className="w-6 h-6" /> Search Jobs</Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f0f5fa]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose {" "}
            <span className="text-[#7263f3] font-extrabold">JobFinder?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col h-full rounded-lg border-none">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className='text-xl mb-2'>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={feature.ctaLink}>{feature.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ),)}
          </div>

          <div className="mt-12 text-center">
            <Badge variant={'outline'}
            className='text-sm font-medium border-gray-400'>
              Trusted by 10,000+ companies worldwide
            </Badge> 
          </div>
        </div>
      </section>

      <section className="py-[7rem] bg-[#d7dedc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href={'/findwork'}>  Find Work</Link>
            </Button>
            <Button size="lg" variant={'outline'} asChild>
              <Link href={'/post'}>Post a Job</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}



//gigfor gigs chargpt
// architecture  fe-be 