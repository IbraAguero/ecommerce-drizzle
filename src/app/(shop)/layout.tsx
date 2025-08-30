import Navbar from "@/components/layout/navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <section className="max-w-7xl mx-auto p-5 pt-28 sm:pt-40 ">
        {children}
      </section>
    </>
  );
}
