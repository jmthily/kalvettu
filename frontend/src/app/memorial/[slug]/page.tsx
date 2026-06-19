import MemorialPublicView from "@/components/MemorialPublicView";

export default async function MemorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MemorialPublicView slug={slug} />;
}
