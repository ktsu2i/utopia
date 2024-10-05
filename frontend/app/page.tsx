import useTest from "@/hooks/useTest";

export default async function Home() {
  const { data } = useTest();

  return (
    <h1>{data}</h1>
  );
}
