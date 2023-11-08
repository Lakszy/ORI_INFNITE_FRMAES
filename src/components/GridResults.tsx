import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
// import { useEffect } from "react";
import { Card } from "./Card";
import { ResponseAPI, Result } from "../interface";
import { getImages } from "../utils";

interface IGridResults {
  handleLoading: (e: boolean) => void;
  query: string;
}

export const GridResults = ({ query, handleLoading }: IGridResults) => {
  const { data, isLoading, error, isError } = useQuery<ResponseAPI>(
    [query],
    () => getImages(query)
  );


  if (isError) return <p>{(error as AxiosError).message}</p>;

  let photos: Result[] = [];

  if (data && typeof data === "string") {
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      const photoElements = xmlDoc.querySelectorAll("photo");

      photos = Array.from(photoElements).map((photoElement) => ({
        id: photoElement.getAttribute("id"),
        owner: photoElement.getAttribute("owner"),
        secret: photoElement.getAttribute("secret"),
        server: photoElement.getAttribute("server"),
        farm: photoElement.getAttribute("farm"),
        title: photoElement.getAttribute("title"),
        ispublic: photoElement.getAttribute("ispublic"),
        isfriend: photoElement.getAttribute("isfriend"),
        isfamily: photoElement.getAttribute("isfamily"),
      }));
    } catch (e) {
      console.error("Error parsing XML data:", e);
    }
  }

  return (
    <>
      <p className="no-results">
        {photos.length === 0 ? "No results with: " : "Results with: "}
        <b>{query}</b>
      </p>

      <div className="grid">
        {photos.map((photo: Result) => (
          <Card key={photo.id} res={photo} />
        ))}
      </div>
    </>
  );
};

