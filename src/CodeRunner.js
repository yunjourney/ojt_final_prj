import React, { useState } from "react";
import axios from "axios";
import Accordion from "./Accordion";

function CodeRunner() {
  const [keywords, setKeywords] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickedResults, setClickedResults] = useState([]);
  // const [accordionTitle, setAccordionTitle] = useState("");
  // const [accordionContents, setAccordionContents] = useState([]);
  const [accordionData, setAccordionData] = useState([]);

  const api_key = "";
  const search = () => {
    setLoading(true);
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `HTML 코드를 알고 싶어. ${keywords} 만드는 방법 알려줘. 다른 설명은 하지 말고, 단답형으로 코드만 알려줘.`,
      },
    ];
    const config = {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    };
    const data = {
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      n: 1,
      messages: messages,
    };
    axios
      .post("https://api.openai.com/v1/chat/completions", data, config)
      .then(function (response) {
        const choices = response.data.choices;
        let resultHTML = [];
        choices.forEach(function (choice, index) {
          const htmlContent = choice.message.content;
          const tagsRegex = /<([a-zA-Z]+)[^>]*>([\s\S]*?)<\/\1>/g; // 태그를 추출하는 정규식
          const tagsOnly = htmlContent.match(tagsRegex);
          if (tagsOnly) {
            console.log(tagsOnly);
            resultHTML = tagsOnly.map((tag, index) => ({
              content: tag,
              hover: false,
            }));
          }
        });
        setResults(resultHTML);
        // setAccordionTitle(keywords); // 검색어로 title 업데이트
        // setAccordionContents((prevContents) => [...prevContents, ...results]); // 이전 contents 값에 현재 results 추가
        setKeywords(""); // 검색어 초기화

        setAccordionData((prevData) => {
          const updatedData = [...prevData];
          const newData = {
            title: keywords,
            contents: resultHTML,
          };
          updatedData.push(newData);
          return updatedData;
        });
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(function () {
        setLoading(false);
      });
  };
  const handleMouseEnter = (index) => {
    setResults((prevResults) =>
      prevResults.map((item, i) =>
        i === index ? { ...item, hover: true } : item
      )
    );
  };
  const handleMouseLeave = (index) => {
    setResults((prevResults) =>
      prevResults.map((item, i) =>
        i === index ? { ...item, hover: false } : item
      )
    );
  };
  const handleClick = (content) => {
    console.log(`클릭된 것은 ${content} 입니다.`);
    setClickedResults((prevClickedResults) => [content, ...prevClickedResults]);
  };
  const onChange = (event, index) => {
    // console.log(event.target.value);
    console.log(results);
    setResults((prevResults) => {
      const updatedResult = [...prevResults];
      updatedResult[index].content = event.target.value;
      return updatedResult;
    });
  };

  return (
    <div>
      <div className="hero bg-dark text-center py-5 mb-4">
        <h1 className="text-white">나만의 코드마켓</h1>
        <h2 className="text-white">Code Runner</h2>
        <div className="search-bar">
          <label htmlFor="keywords">키워드:</label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            className="search-input"
            placeholder="HTML 요소명을 입력하세요"
            required
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <button className="search-button" onClick={search}>
            검색
          </button>
        </div>
        <br />
        <br />

        {results.length > 0 && (
          <div
            id="result"
            style={{
              backgroundColor: "ivory",
              borderRadius: "5px",
              width: "50%",
              margin: "0 auto",
            }}
          >
            {loading ? (
              <div> Loading... </div>
            ) : (
              results.map((item, index) => (
                <div key={index}>
                  <textarea
                    type="text"
                    id="searchedCode"
                    value={item.content}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    style={{
                      backgroundColor: item.hover ? "beige" : "transparent",
                      cursor: item.hover ? "pointer" : "auto",
                      width: "80%",
                      height: "auto",
                      overflow: "auto",
                      whiteSpace: "pre-wrap",
                      border: "1px solid #ccc",
                      padding: "5px",
                    }}
                    onChange={(event) => onChange(event, index)}
                  />
                  <button key={index} onClick={() => handleClick(item.content)}>
                    Run
                  </button>
                </div>
              ))
            )}
          </div>
        )}
        <br />

        {clickedResults.length > 0 && (
          <div
            style={{
              backgroundColor: "ivory",
              borderRadius: "5px",
              width: "50%",
              margin: "0 auto",
            }}
          >
            <h3>Results:</h3>
            {clickedResults.map((results, index) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: results }}
              ></div>
            ))}
          </div>
        )}
      </div>
      {accordionData.length > 0 && (
        <Accordion
          title={accordionData[accordionData.length - 1].title}
          contents={accordionData[accordionData.length - 1].contents}
        />
      )}

      {accordionData.slice(0, accordionData.length - 1).map((data, index) => (
        <Accordion key={index} title={data.title} contents={data.contents} />
      ))}
    </div>
  );
}
export default CodeRunner;
