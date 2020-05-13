// stub

(function ($) {
    // Let's start writing AJAX calls!
    console.log("In ajax"); 
    var commentForm = $('#form-comment'),
        newCommentInput = $('#phrase'),
        commentArea = $('#comment-area');
  
    commentForm.submit(function (event) {
      event.preventDefault();
      gameId = currentLink.data('id');
      var newComment = newCommentInput.val();
      console.log(newComment);
      if (newComment) {
          var requestConfig = {
            method: 'POST',
            url: '/dashboard/comments',
            contentType: 'application/json',
            data: JSON.stringify({
              gameId: gameId,  
              comment: newComment
            })
          };
  
          $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            var newElement = $(responseMessage);
            commentArea.append(newElement);
          });
        
      }
    });
  })(window.jQuery);