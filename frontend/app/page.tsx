import axios from "axios";
import { useEffect, useState } from "react";

export default async function Home() {
  const [data, setData] = useState();

  useEffect(() => {
    axios.get("./api/test")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);

  return (
    <h1>{data}</h1>
  );
}
