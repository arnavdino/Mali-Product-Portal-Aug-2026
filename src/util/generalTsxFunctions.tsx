export const injectLink = (title: string) => {
    let words: string[] = title.split(" ");
    words = words.map((word) =>
      word.includes("http") ? (
        <>
          {injectNewLineFirst(word)}
          <a
            className="underline App-link cursor-pointer"
            href={injectNewLineLast(word)}
            target="_blank"
          >
            {injectNewLineLast(word)}
          </a>
        </>
      ) : (
        injectNewLine(word)
      )
    ) as any;
    return words;
  }
  
  export const injectNewLineFirst = (word: string) => {
    return word.includes("\n") ? (
      <>
        {word.split("\n")[0]} <br />
      </>
    ) : (
      ""
    );
  }
  const injectNewLineLast = (word: string) => {
    return word.includes("\n") ? word.split("\n")[1] : word;
  }
  
  const injectNewLine = (word: string) => {
    return word.includes("\n") ? (
      <>
        {word.split("\n")[0]}
        <br />${word.split("\n")[1]}
      </>
    ) : (
      word + " "
    );
  }