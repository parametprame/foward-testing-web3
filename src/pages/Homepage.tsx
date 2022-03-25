import { Lending } from "../components/Lending";
import { Unlending } from "../components/Unlending";

export const Homepage = () => {
  return (
    <section className="w-full h-screen	 bg-[#191919] ">
      <div className="container mx-auto py-6 px-10 ">
        <div className="grid grid-cols-2 mt-10 gap-5 h-full px-20	justify-items-center	">
          <Lending />
          <Unlending />
        </div>
      </div>
    </section>
  );
};

