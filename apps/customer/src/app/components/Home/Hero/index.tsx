import Link from "next/link";
import Dropdownone from "./Dropdownone";
import Dropdowntwo from "./Dropdowntwo";

const Banner = () => {
  return (
    <section id="Home" className=" h-dvh bg-[#FCF6EF] place-content-center">
      <div className="relative px-6 lg:px-8">
        <div className="container">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="leading-tight font-bold tracking-tight max-w-4xl mx-auto">
              Your Neighborhood Barbershop Reimagined
            </h1>
            <p className="text-lg leading-8 text-black">
              Step in for a trim, walk out with confidence
            </p>
          </div>

          {/* DROPDOWN BUTTONS */}

          <div className="mx-auto max-w-4xl mt-12 p-6 lg:max-w-4xl lg:px-8 bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-8 xl:gap-x-8">
              <div className="col-span-3">
                <Dropdownone />
              </div>
              <div className="col-span-3">
                <Dropdowntwo />
              </div>
              <div className="col-span-3 sm:col-span-2 mt-2">
                <Link href={"/#courses-section"}>
                  <button className="bg-primary w-full hover:bg-transparent hover:text-primary duration-300 border border-primary text-white font-bold py-4 px-3 rounded-sm hover:cursor-pointer">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
