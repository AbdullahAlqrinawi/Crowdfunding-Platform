import styles from "../../style";
import { robot2 } from "../../assets";
import { Link } from "react-router-dom";

const DashboardHero = () => {
  return (
    <section className={`flex md:flex-row flex-col ${styles.paddingY}`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[52px] text-[40px] text-white ss:leading-[75px] leading-[60px]">
            Start Your <br className="sm:block hidden" />
            <span className="text-gradient">Crowdfunding Journey</span>
          </h1>
        </div>

        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Launch your project and connect with backers globally. Secure, fast, and borderless fundraising powered by crypto.
        </p>

        <div className="mt-8">
          <Link
            to="/create-project"
            className="rounded-md px-5 py-3 text-sm font-medium text-primary bg-blue-gradient hover:scale-105 transition-transform"
          >
            Create Project
          </Link>
        </div>
      </div>

      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
        <img src={robot2} alt="hero" className="w-[100%] h-[100%] relative z-[5]" />
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
      </div>
    </section>
  );
};

export default DashboardHero;
