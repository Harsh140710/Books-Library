document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector(".container");
  const bookContainer = document.getElementById("bookContainer");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const errorMsg = document.getElementById("MessageDisplay");
  const switchBtn = document.getElementById("switchBtn");

  let allBooks = [];
  let currentPage = 1;

  FetchData();

  async function FetchData(page = 1) {

    // const axios = require('axios').default;

    const options = {
      method: 'GET',
      url: 'https://api.freeapi.app/api/v1/public/books',
      params: {page: page.toString(), limit: '10', inc: 'kind%2Cid%2Cetag%2CvolumeInfo', query: 'tech'},
      headers: {accept: 'application/json'}
    };
    try {
      errorMsg.classList.remove("hidden");
      errorMsg.textContent = "Please Wait...";
      errorMsg.className = "errorMessage";

      // const url = "https://api.freeapi.app/api/v1/public/books";
      // const response = await axios.request(options);
      // console.log(response);

      const {data} = await axios.request(options);
      // console.log(data);

      const bookData = data.data.data;
      console.log("bookdata", bookData)


      // add all the data into a array
      let newBooks = bookData.map((data) => {
        let bookTitle = data.volumeInfo.title;
        // console.log(bookTitle);   

        if(bookTitle.length > 0) bookTitle = `${bookTitle.substring(0, 20)}...`;

        // please title keep let beacase of this is change on the condition
        // it is not working with const
        // const title = data.items.snippet.title;
        // if (title.length > 10) title = `${title.substring(0, 20)}...`;

        const bookImage = data.volumeInfo.imageLinks.thumbnail;
        // console.log(bookImage);

        const authorName = data.volumeInfo.authors?.[0];
        // console.log(authorName);

        const infoLink = data.volumeInfo.previewLink;
        // console.log(infoLink);

        const publishDate = data.volumeInfo.publishedDate;
        // console.log(publishDate);

        // allBooks.push({ bookTitle, bookImage, authorName, infoLink, publishDate });

        return { bookTitle, bookImage, authorName, infoLink, publishDate };

        // allBooks = [...allBooks,{ bookTitle, bookImage, authorName, infoLink, publishDate }];

      });
      
      allBooks = [...allBooks,...newBooks]; 
      showCards(newBooks);
      
      // display all card
    } catch (err) {
      errorMsg.textContent = "Please check your network connection...";
      errorMsg.className = "errorMessage";
      console.error(err); // for debugging
    }
    
  }

  // displaying all cards
  function showCards(arr) {

    if (arr.length > 0) errorMsg.classList.add("hidden");

    arr.forEach((book) => {
      const bookCard = showACard({
        bookTitle: book.bookTitle,
        bookImage: book.bookImage,
        authorName: book.authorName,
        infoLink: book.infoLink,
        publishDate: book.publishDate,
      });

      // adding Single card to container to dispaly
      bookContainer.appendChild(bookCard);
    });
  }

  function showACard({ bookTitle, bookImage, authorName, infoLink, publishDate }) {
    const bookCard = document.createElement("div");
    bookCard.className = "gridBook";

    const imageDiv = document.createElement("div");
    imageDiv.className = "image";

    const thumbnail = document.createElement("img");
    thumbnail.src = bookImage;
    thumbnail.alt = bookTitle;

    const details = document.createElement("div");
    details.id = "details";

    const BookTitleName = document.createElement("div");
    BookTitleName.className = "bookTitle";
    BookTitleName.textContent = bookTitle;

    const authoName = document.createElement("div");
    authoName.className = "authorName";
    authoName.textContent = authorName;

    const publishedDate = document.createElement("p");
    publishedDate.className = "publishDate";
    publishedDate.textContent = publishDate;

    const detailBtn = document.createElement("button");
    detailBtn.textContent = "More Info";
    detailBtn.className = "linkBtn";

    detailBtn.onclick = () => {
      window.open(infoLink, "_blank");
    };

    const showMoreBtn = document.createElement('div');
    showMoreBtn.className = "showMoreBtn";
    showMoreBtn.textContent = "show More";

    imageDiv.appendChild(thumbnail);

    details.appendChild(BookTitleName);
    details.appendChild(authoName);
    details.appendChild(publishedDate);
    details.appendChild(detailBtn);

    bookCard.appendChild(imageDiv);
    bookCard.appendChild(details);

    mainContainer.appendChild(showMoreBtn);

    showDisplayData();

    function showDisplayData() {
      let isListView = false;

      switchBtn.addEventListener("click", function () {
        isListView = !isListView;

        if (isListView) {
          // Switch to list view
          bookContainer.classList.remove("gridBookContainer");
          bookContainer.classList.add("listBookContainer");

          bookCard.classList.remove("gridBook");
          bookCard.classList.add("listBook");
          detailBtn.classList.remove("linkBtn");
          detailBtn.classList.add("listBtn");

          details.classList.add("details");

          switchBtn.innerHTML = `<i class="fa fa-th" aria-hidden="true"></i>`;
        } else {
          // Switch to grid view
          bookContainer.classList.remove("listBookContainer");
          bookContainer.classList.add("gridBookContainer");
        
          if (BookTitleName.textContent.length > 10) BookTitleName.textContent = `${BookTitleName.textContent.substring(0, 20)}...`;

          bookCard.classList.remove("listBook");
          bookCard.classList.add("gridBook");
          detailBtn.classList.add("linkBtn");
          detailBtn.classList.remove("listBtn");

          details.classList.remove("details");

          switchBtn.innerHTML = `<i class="fa fa-bars" aria-hidden="true"></i>`;
        }
      });

      showMoreData();
      function showMoreData () {
        showMoreBtn.addEventListener("click", async () => {
          currentPage++;
          await FetchData(currentPage);
        })
      }
    }

    return bookCard;
  }

  //when user input
  searchInput.addEventListener("input", searchBar);

  searchBtn.addEventListener("click", searchBar);

  function searchBar() {
    bookContainer.innerHTML = "";
    // get inserted value
    const query = searchInput.value.trim();
    if (!query) {
      //if  nothing is typed then show all videos
      showCards(allBooks);
      return;
    }

    let newBookArray = [];

    newBookArray = allBooks.filter((book) => {
      return book.bookTitle.toLowerCase().includes(query.toLowerCase());
    });

    if (newBookArray.length <= 0) {
      errorMsg.classList.remove("hidden");
      errorMsg.textContent = "No Video Found";
      errorMsg.className = "errorMessage";
    }

    // showing founded videos
    showCards(newBookArray);
  }
});
