export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-semibold">Class Details</h1>
    </section>
  );
}
