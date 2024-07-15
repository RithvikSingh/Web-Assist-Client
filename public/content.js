// To reset extension's state on new session
const initialColors = [
  "yellow",
  "green",
  "cyan",
  "gray",
  "orange",
  "pink",
  "blue",
  "purple",
  "rose",
  "teal",
];
chrome.storage.local.set({ highlightedWords: [], availableColors: initialColors, 
            chatInputValue: "", chatResponseValue: "", chatWasSubmitted: false,
            summaryInputValue: "", summaryResponseValue:"", summaryWasSubmitted: false});

const messagesFromReactAppListener = (message, sender, response) => {

    console.log('[content.js]. Message received', {
      message,
      sender,
    })
  
    if (sender.id === chrome.runtime.id && message.from === "react" && message.message === 'Get page text') {
      const pageText = document.body.innerText;
      response(pageText);
    }


    if (sender.id === chrome.runtime.id && message.from === "react" && message.message.startsWith("highlight")) {
      let splits = message.message.split(" ");
      const searchTerm = splits[1];
      const className = "highColor" + splits[2].charAt(0).toUpperCase() + splits[2].slice(1);
      const searchTermRegex = new RegExp(searchTerm, 'gi'); // 'g' for global match and 'i' for case insensitive
      
      // Function to recursively traverse and highlight text nodes
      function highlightTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const matches = node.nodeValue.match(searchTermRegex);
          if (matches) {
            const span = document.createElement('span');
            span.innerHTML = node.nodeValue.replace(searchTermRegex, (match) => `<span class=${className}>${match}</span>`);
            node.parentNode.replaceChild(span, node);
          }
        } else {
          for (let child of node.childNodes) {
            highlightTextNodes(child);
          }
        }
      }
    
      highlightTextNodes(document.body);
      response("Done")
    }

    if (sender.id === chrome.runtime.id && message.from === "react" && message.message.startsWith("unhighlight")) {
      let splits = message.message.split(" ");
      const className = "highColor" + splits[1].charAt(0).toUpperCase() + splits[1].slice(1);
      const highlightedElements = document.querySelectorAll(`span.${className}`);
      
      highlightedElements.forEach(element => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.innerText), element);
        parent.normalize(); // Merge adjacent text nodes
      });

      response("Done")
    }
}
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);


// const messagesFromReactAppListener = (message, sender, response) => {

//     console.log('[content.js]. Message received', {

//         message,

//         sender,

//     })

//     if (

//         sender.id === chrome.runtime.id &&

//         message.from === "react" &&

//         message.message === 'Hello from React') {

//         response('Hello from content.js');

//     }

//     if (

//         sender.id === chrome.runtime.id &&

//         message.from === "react" &&

//         message.message === "delete logo") {

//         console.log("DELETE Message RECIEB")

//     }

// }

// chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

// Mock response from LLM model

// const quotedLines = [
//   "Mummies (Spanish: Momias), is a 2023 English-language Spanish animated comedy film directed by Juan Jesús García Galocha (in his feature directorial debut) from a screenplay by Javier López Barreira and Jordi Gasull and a story by Gasull. It features the voices of Joe Thomas, Eleanor Tomlinson, Celia Imrie, Hugh Bonneville and Sean Bean.[6]",
//   "Initially scheduled for release in 2021, Mummies was theatrically released in Spain on February 24, 2023.[7]",
//   "The film follows three mummies from the underworld who embark on a journey and end up in present-day London in search of an old ring belonging to an Ancient Egyptian Royal Family that was stolen from a tomb by the ambitious archaeologist Lord Carnaby, whose goal is to kidnap Princess Nefer for an exhibition after her irrepressible singing goes viral.",
//   "Mummies was scheduled to be released in 2021 under the name Moomios as part of a partnership between Atresmedia Cine and Warner Bros. España.[7] However, it was later delayed to 2023 after two years of extended production and was changed to its current name.",
//   "The film was released in Spain and in selected theatres in the United States by Warner Bros. Pictures on February 24, 2023.[1] The film was first released in international territories, beginning with Australia, on January 5, 2023.",
//   "On review aggregation website Rotten Tomatoes, the film holds an approval rating of 53% based on 19 reviews, with an average rating of 5.00/10.[8]",
//   "2023 29th Forqué Awards Best Animation Film Nominated [9]",
//   "2024 38th Goya Awards Best Animated Film Nominated [10]"
// ];
