import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useTransition } from "react";

import "./styles.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [url, setUrl] = useState("");
  const [shouldFetchImages, setShouldFetchImages] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loader = useRef(null);

  const client_id = "4mB0CC1xdwTfTQGjF1v1uO9vS2Z8ubzBPd4X0B86IEU";
  const fetchUrl = `https://api.unsplash.com/search/photos?client_id=${client_id}&query=${query}&page=${page}`;

  const searchImages = (e) => {
    if (e.keyCode === 13) {
      console.log(fetchUrl);
      setQuery(input);
      setData([]);
      startTransition(() => {
        setShouldFetchImages(true);
      });
    }
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
      startTransition(() => {
        setShouldFetchImages(true);
      });
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchUrl]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "120px",
      threshold: 0.5
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const fetchImages = async () => {
    if (setShouldFetchImages) {
      const res = await axios.get(fetchUrl);
      setData([...data, ...res.data.results]);
      setShouldFetchImages(false);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Infinite Scrolling App</h1>
        <input
          type="text"
          value={input}
          onKeyDown={(e) => searchImages(e)}
          onChange={handleChange}
          placeholder="Search keyword"
        />
      </div>
      <> {isPending && <div> Pending ... </div>}</>
      <div className="main flex">
        {data.length > 0 &&
          data.map((data, key) => (
            <div className="container" key={key}>
              <img
                src={data.urls.small}
                className="image"
                alt={data.alt_description}
              />
              <h4>Photo by {data.user.name} 📸</h4>
            </div>
          ))}
      </div>

      <div ref={loader} />
    </div>
  );
}
