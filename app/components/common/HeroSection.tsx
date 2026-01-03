import Image from "next/image";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Carousel } from "../ui/Carousel";

const HeroSection = () => {


  const slides = [
    <div key="1" className="relative h-96 bg-linear-to-r from-blue-500 to-purple-500">
             <Image src={"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} width={400} height={600} alt={"image"} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_2px_2px,white_2px,transparent_2px)]" style={{ backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 flex items-center justify-center font-extrabold text-blue-300 text-shadow-lg text-8xl text-shadow-gray-500">
                      Men's Collection
           </div>
    </div>,

    <div key="2" className="relative h-96 bg-linear-to-r flex justify-center items-center from-black via-gray-800 to-black text-white overflow-hidden">
      <Image src={"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} width={600} height={300} alt={"womens"} className="w-full h-full object-cover"/>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)]" style={{ backgroundSize: '40px 40px' }} />
        <div className="text-center">
          <h1 className="text-5xl font-bold">Winter Sale</h1>
          <p className="text-xl mt-4">Up to 50% off</p>
        </div>
    </div>,
    // ... more slides
  ];

  return (       
      <Carousel slides={slides}/>     
  );
};

export default HeroSection