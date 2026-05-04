import Category from "@/src/components/products/categories";
import HeroSlider from "@/src/components/products/customswiper";
import { MostSaled } from "@/src/components/products/most-saled";

export default function Page() {
  return (
    <div>
      <HeroSlider />
      <MostSaled />
      <Category/>
    </div>
  );
}
