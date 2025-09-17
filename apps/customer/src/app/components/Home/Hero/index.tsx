import { Dropdown } from "./Dropdown";

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

          <Dropdown />
        </div>
      </div>
    </section>
  );
};

export default Banner;
