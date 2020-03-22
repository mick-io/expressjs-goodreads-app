import axios from "axios";
import xml2js from "xml2js";
import Debug from "debug";

import { goodreadsKey } from "../config/goodreads";

interface IBookService {
  getByID(id: string): Promise<any>;
}

const debug: Debug.Debugger = Debug("app:goodreadsService");
const parser: xml2js.Parser = new xml2js.Parser({ explicitArray: false });

function goodreadsService() {
  async function getByID(id: string) {
    try {
      const url = `https://www.goodreads.com/book/show/${id}.xml?key=${goodreadsKey}`;
      const response = await axios.get(url);
      parser.parseString(response.data, (err: Error, result: any) => {
        if (err) {
          debug(err);
          return err;
        }
        debug(result);
        return result.GoodreadsResponse.book;
      });
    } catch (err) {
      debug(err);
      return err;
    }
  }
  // function getByID(id: string) {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`https://www.goodreads.com/book/show/${id}.xml?key=${goodreadsKey}`)
  //       .then(response => {
  //         parser.parseString(response.data, (err: Error, result: any) => {
  //           if (err) {
  //             debug(err);
  //           } else {
  //             debug(result);
  //             resolve(result.GoodreadsResponse.book);
  //           }
  //         });
  //       })
  //       .catch(err => {
  //         debug(err);
  //         reject(err);
  //       });
  //   });
  // }
  return { getByID };
}

const booksService: IBookService = goodreadsService();

export { IBookService, booksService };
