import { card } from "../../assets";
import styles, { layout } from "../../style";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
      Find the perfect platform <br className="sm:block hidden" /> for your crypto-powered idea
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
      Launch your campaign and start accepting digital currency in just a few clicks. Whether you're building a product, supporting a cause, or sharing a bold vision—we make crypto crowdfunding simple, secure, and global.</p>
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="billing" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default CardDeal;
