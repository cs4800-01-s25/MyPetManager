import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

// Values section data
const valuesData = [
  {
    title: "Simplicity",
    image: "/little-dog-as-a-vet-wearing-robe-and-stethoscope---isolated-over.png",
    description:
      "We make pet care effortless by providing a centralized platform to track appointments, vaccinations, and health records - all in one place.",
  },
  {
    title: "Compassion",
    description:
      "We believe every pet deserves love, attention, and personalized care. Our platform ensures pet owners can manage their pet's well-being with ease and empathy.",
  },
  {
    title: "Security & Privacy",
    image: "/pet-care-data-model-1.png",
    description: "Your pet's data is safe with us",
  },
  {
    title: "Community",
    image: "/depositphotos-151564708-l-2015-1030x675-1.png",
    description:
      "We connect pet owners with a network of caregivers, veterinarians, and fellow pet lovers to foster a strong, supportive pet care community.",
  },
];

export const Home = () => {
  return (
    <>
      {/* Hero Section */}
<section className="w-full max-w-[1440px] flex flex-col md:flex-row items-center justify-between px-6 pt-32 pb-32 bg-white">
  <img
    className="w-[800px] h-auto object-contain"
    alt="Dogs transparent"
    src="dogggg.png"
  />

  <div className="flex flex-col items-center text-center max-w-[580px]">
    <h1 className="font-['Poltawski_Nowy',Helvetica] font-normal text-[#222222] text-[58px] leading-[68px]">
      Manage your pet's health with ease
    </h1>

    <p className="mt-5 opacity-70 font-['Poppins',Helvetica] text-[#222222] text-[18px] leading-[30px] max-w-[500px]">
      Tired of juggling vet visits, medications, and finding trusted pet
      services? Stay organized, schedule appointments, and connect with a
      pet-loving community — all in one place.
    </p>

    <Button className="mt-10 h-[60px] w-[190px] bg-[#7c5c42] rounded-full shadow-inner-shadow-100">
      <span className="text-[22px] font-['Poltawski_Nowy',Helvetica] font-bold text-white leading-[26px]">
        Get Started
      </span>
    </Button>
  </div>
</section>

      {/* Pet Care Solutions Section */}
      <section className="w-full max-w-[1440px] bg-[#e8e1d9] relative px-4 pt-28 pb-[220px] overflow-hidden">
  <h2 className="text-center text-[70px] leading-[80px] font-['Poltawski_Nowy',Helvetica] font-normal text-[#222222] mb-12 z-20 relative">
    Our pet care solutions
  </h2>

  {/* Circles Row */}
  <div className="flex justify-around items-center relative z-10">
    {/* Circle 1 */}
    <div className="w-64 h-64 bg-white rounded-full flex flex-col justify-center items-center text-center border border-black shadow-md">
      <h2 className="text-[20px] font-['Poltawski_Nowy',Helvetica] font-bold mb-3">Health Portal</h2>
      <p className="px-4 text-sm">Keep track of medication and refill reminders</p>
    </div>

    {/* Circle 2 */}
    <div className="w-64 h-64 bg-white rounded-full flex flex-col justify-center items-center text-center border border-black shadow-md">
      <h3 className="text-[20px] font-['Poltawski_Nowy',Helvetica] font-bold mb-3">Scheduler</h3>
      <p className="px-4 text-sm">Include option of booking appointments for pet service</p>
    </div>

    {/* Circle 3 */}
    <div className="w-64 h-64 bg-white rounded-full flex flex-col justify-center items-center text-center border border-black shadow-md">
      <h3 className="text-[20px] font-['Poltawski_Nowy',Helvetica] font-bold mb-3">A Forum Page</h3>
      <p className="px-4 text-sm">Add a local forum page for local discussions</p>
    </div>
  </div>

  {/* Paw Images — pulled up to overlap */}
  <img
    src="/nexus2cee-cat-paw-1.png"
    alt="Grey Paw"
    className="absolute bottom-[-40px] left-[26%] h-[340px] object-contain z-0"
  />
  <img
    src="/paws-1.png"
    alt="Yellow Paw"
    className="absolute bottom-[-40px] left-[63%] h-[340px] object-contain z-0"
  />
</section>
 {/* Dedicated to Simplifying Pet Care Section */}
<section className="w-full max-w-[1440px] pt-32 pb-32 px-4 bg-white">
  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
    
    <div className="max-w-[520px] md:w-1/2">
      <h2 className="font-['Poltawski_Nowy',Helvetica] font-normal text-[#1e1e1e] text-5xl tracking-[-1.1px] leading-[1.2] mb-8">
        We are Dedicated to Simplifying Pet Care
      </h2>

      <p className="opacity-70 font-['Poppins',Helvetica] text-[#222222] text-[18px] leading-[28px] max-w-[400px]">
        My Pet Manager is more than just a website – it’s your all-in-one solution for keeping your pet’s health, appointments, and daily needs organized. From tracking vaccinations and vet visits to setting reminders for feeding and grooming, we ensure that managing your pet’s care is effortless. Because every pet deserves the best care, and every owner deserves peace of mind.
      </p>
    </div>

    <img
      className="w-[420px] h-[420px] object-contain md:w-[460px] md:h-[460px]"
      alt="Cat poster"
      src="/cat-poster-1.png"
    />
    
  </div>
</section>

      {/* Our Values Section */}
      <section className="w-full max-w-[1440px] py-[120px] px-[100px] bg-[#e8e1d9]">
        <h2 className="font-['Poltawski_Nowy',Helvetica] font-normal text-black text-6xl text-center mb-16">
          Our Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]">
          {/* Values Cards */}
          {valuesData.slice(0, 3).map((value, index) => (
            <Card
              key={index}
              className={`w-full ${
                index === 0 ? "h-[533px]" : "h-[293px]"
              } bg-white rounded-[10px] flex flex-col p-10 pb-6`}
            >
              <Button
                variant="outline"
                className="rounded-[50px] border border-solid border-[#222222] px-[35px] py-[15px]"
              >
                <span className="font-body-text-1 text-black text-center whitespace-nowrap">
                  {value.title}
                </span>
              </Button>

              <CardContent className="p-0 relative">
                {value.image && (
                  <img
                    className="w-[223px] h-[132px] mt-[67px]"
                    alt={value.title}
                    src={value.image}
                  />
                )}
                <p className="font-paragraph-1 text-black mt-4">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Community Card */}
          <Card className="w-full md:col-span-2 h-[210px] bg-white rounded-[10px] flex flex-col p-10 pb-6">
            <Button
              variant="outline"
              className="rounded-[50px] border border-solid border-[#222222] px-[35px] py-[15px]"
            >
              <span className="font-body-text-1 text-black text-center whitespace-nowrap">
                Community
              </span>
            </Button>

            <CardContent className="p-0 flex justify-between items-center">
              <p className="font-paragraph-1 text-black max-w-[445px] mt-[65px]">
                {valuesData[3].description}
              </p>

              <img
                className="w-[223px] h-[146px] object-cover"
                alt="Depositphotos"
                src={valuesData[3].image}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
<section className="w-full max-w-[1440px] py-16 px-4 bg-white relative">
  <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-8 max-w-[1200px] mx-auto">
    <div className="max-w-[616px]">
      <h2 className="font-['Poltawski_Nowy',Helvetica] font-normal text-[#222222] text-[53px] leading-normal">
        Never Miss a Vet Visit! Schedule or Set a Reminder for Your Pet's
        Next Appointment Today!
      </h2>

      <Button className="mt-12 h-[67px] w-[290px] bg-[#7C5C42] hover:bg-[#6a4f38] rounded-[50px] shadow-md transition-colors duration-200">
        <span className="text-2xl font-['Poltawski_Nowy',Helvetica] font-bold text-white text-center leading-[26px] whitespace-nowrap">
          Get A Reminder
        </span>
      </Button>
    </div>

    <img
      className="w-[480px] h-[422px] object-cover"
      alt="Element bunny"
      src="/286-2860452-bunny-rabbit-png-1.png"
    />
  </div>
</section>
    </>
  );
};