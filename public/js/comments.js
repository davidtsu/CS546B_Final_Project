(function ($) {
    console.log("In ajax"); 
    var commentForm = $('#form-comment');
    var newCommentInput = $('#phrase');
    var commentArea = $('#comment-area');
  
    commentForm.submit(function (event) {
      event.preventDefault();
    //   var currentLink = $(this);
    //   gameId = currentLink.data('id');
      var currentLink = window.location.pathname.split('/');
      var gameId = currentLink[3];
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