import axios from 'axios';
import { ResponseAPI } from "../interface";
import { AxiosError } from 'axios';

const ACCESS_KEY = "94fdd14a300113aff95a76b9c8996483";

export const getImages = async (query: string): Promise<ResponseAPI> => {
   const url= `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=94fdd14a300113aff95a76b9c8996483&text=${query}&safe_search=2`
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}
