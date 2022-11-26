import axios from "axios";
import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchBarExample = ({ apiKey, targetField, targetIndexName }) => {
  const [searchContent, setSearchContent] = useState("");
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const handleChange = async (e) => {
    setSearchContent(e.target.value);
    setSuggestedItems(
      await getSuggestion(targetIndexName, targetField, e.target.value)
    );
  };
  const highlightedText = (text, query) => {
    if (query !== "" && text.includes(query)) {
      const parts = text.split(new RegExp(`(${query})`, "gi"));
      return (
        <>
          {parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
              <mark key={index}>{part}</mark>
            ) : (
              part
            )
          )}
        </>
      );
    }
    return text;
  };
  const getSearchResult = async (indexName, fieldName) => {
    const res = await axios.post(
      `https://api.agofind.com/api/v1/documents/${indexName}/search`,
      {
        query: {
          match: {
            [fieldName]: searchContent,
          },
        },
      },
      {
        headers: {
          "X-API-Key": apiKey,
        },
        withCredentials: true,
      }
    );
    return res.data.hits.hits;
  };
  const getSuggestion = async (indexName, fieldName, curString) => {
    const res = await axios.post(
      `https://api.agofind.com/api/v1/documents/${indexName}/search`,
      {
        query: {
          match: {
            [`${fieldName}Jamo`]: curString,
          },
        },
      },
      {
        headers: {
          "X-API-Key": apiKey,
        },
        withCredentials: true,
      }
    );
    return res.data.hits.hits;
  };
  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      setSearchResult(await getSearchResult(targetIndexName, targetField));
    }
  };

  return (
    <div className="w-[600px]">
      <div className="w-[550px] p-2 flex items-center rounded-md border bg-white">
        <input
          type="text"
          className="w-full p-3 focus:placeholder:text-transparent focus:outline-none border-none "
          onChange={handleChange}
          value={searchContent}
          onKeyPress={handleKeyPress}
          placeholder="무엇을 찾고 싶으신가요?"
        />
        <BiSearchAlt2 className="bg-white" size={26} />
      </div>
      {suggestedItems.length !== 0 && (
        <div className="bg-white w-full space-y-3 p-4 text-gray-400">
          {suggestedItems.map((tmp, index) => (
            <div key={index}>
              <p>
                {highlightedText(
                  tmp.source[`${targetField}Jamo`]
                    .split(" ")
                    .slice(0, searchContent.split(" ").length + 2)
                    .join(" "),
                  searchContent
                )}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-4">
        {searchResult.map((searchItem) => (
          <div className="shadow-lg p-4 space-y-2">
            {Object.keys(searchItem.source).map((field) => (
              <div className="p-2 border">
                {field} : {searchItem.source[field]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBarExample;
