import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import flower from '@/assets/Flowerb.png';
import flower2 from '@/assets/ban2.png'
import nature from '@/assets/nature-removebg-preview.png'
const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
      <Image
        className="max-w-70"
        src={flower2}
        alt="Flowers-box"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
        Handmade with Heart, Crafted for You                </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
        🌸  Discover unique, lovingly made crafts — perfect for every special moment.
</p>
        <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white">
          Buy now
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className="hidden md:block max-w-80"
        src={flower}
        alt="md_controller_image"
      />
      <Image
        className="md:hidden"
        src={flower}
        alt="sm_controller_image"
      />
    </div>
  );
};

export default Banner;