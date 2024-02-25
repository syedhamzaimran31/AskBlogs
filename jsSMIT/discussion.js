document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the selected post data from localStorage
  const selectedPost = JSON.parse(localStorage.getItem("selectedPost"));

  // Check if selectedPost is not null or undefined
  if (selectedPost) {
    // Access the properties of the selected post
    const title = selectedPost.title;
    const description = selectedPost.description;
    const displayName = selectedPost.userName; // Make sure to update this if the property name is different
    const email = selectedPost.email;
    const date= selectedPost.date

    const postItem= document.createElement("div");
     postItem.innerHTML= `<div id="article">
      <div id="blogPost">
        <article class="prose">
          <h2
            class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
          >
          ${title}
          </h2>
          <p class="mt-6 text-xl leading-8 text-gray-700">
          ${description}
          </p>
          <br>
          <p id="puslisherName" class="text-gray-900">Published By: ${displayName}</p>
          <p id="publishDate" class="text-gray-900">Date: ${date}</p>

          <div id="replyBlogPost">
            <h6
              class="text-1xl font-bold leading-7 text-gray-900 sm:truncate sm:text-1xl sm:tracking-tight"
            >
              Reply
            </h6>
            <textarea
              id="textarea"
              class="textarea textarea-warning"
              placeholder="Bio"
            ></textarea>
            <button
              id="btnSubmitDiscussion"
              class="btn btn-outline btn-primary"
            >
              Submit
            </button>
          </div>
        </article>
      </div>
      `;
      document.body.appendChild(postItem);
  } else {
    console.error("No post data found in localStorage");
  }
});
