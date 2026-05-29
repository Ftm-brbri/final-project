import Category from "@/src/components/products/categories";
import HeroSlider from "@/src/components/products/customswiper";
import HeroBanner from "@/src/components/products/heroBanner";
import { MostSaled } from "@/src/components/products/most-saled";

export default function Page() {
  return (
    <div>
      <HeroSlider />
      <MostSaled />
      <div id="categories-section">
        <Category />
      </div>
      <HeroBanner />
    </div>
  );
}
