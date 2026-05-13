import SingleProductPage from "@/src/components/single-products/single-product";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <SingleProductPage productId={id} />;
}