      $(document).ready(function(){
        var $button = $('<button>Load new Tweets</button>');
        var $container = $('.container');
        var $tweetPostContainer = $('.postTweet'); 
        var $right = $('.right');

        $button.addClass('load');
        $button.attr('id', 'home');
        $button.appendTo($container.children('.buttonContainer'));

        var lastIndexLoaded = 0;

        var loadTweets = function(index, stopIndex, tweetArr){
          
          lastIndexLoaded = index;
          while(stopIndex <= index){

            var tweet = tweetArr[stopIndex];
            var $tweet = tweetBlock(tweet);
            $tweet.hide().prependTo($container.children('.tweetContainer')).fadeIn(500);

            stopIndex += 1;
          }
        }

        var tweetBlock = function(tweet){
            var $tweet = $('<div></div>');
            var $timestamp = $('<p></p>');
            var $user = $('<strong></strong');
            
            $timestamp.text(moment(tweet.created_at).fromNow());
            $user.text('@' + tweet.user);

            return $tweet.append($user, ': ' + tweet.message, $timestamp);
        }

        loadTweets(streams.home.length - 1, 0, streams.home);

        $container.on('click', '.load', function(){
          if($(this).attr('id') === 'home'){
            loadTweets(streams.home.length - 1, lastIndexLoaded + 1, streams.home)
          }
          else if($(this).attr('id') !== 'submitTweet'){
            loadTweets(streams.users[$(this).attr('id')].length - 1, lastIndexLoaded + 1, streams.users[$(this).attr('id')]);
          }
        });

        $container.on('click', '.back', function(){
          $container.children().html('');
          $button.attr('id', 'home');
          $button.appendTo($container.children('.buttonContainer'));

          loadTweets(streams.home.length - 1, 0, streams.home);
        })

        $tweetPostContainer.on('click', '#submitTweet', function(){
          var message = $('input').val();
          if(message.length === 0){
            return;
          }
          visitor = "someTwittler";
          if(streams.users[visitor] === undefined){
            streams.users[visitor] = [];
          }
          writeTweet(message);

          var $tweet = tweetBlock(streams.users[visitor][streams.users[visitor].length - 1]);
          $tweet.hide().prependTo($right.children('.myTweetContainer')).fadeIn(500);
          $('input').val('');
          loadTweets(streams.home.length - 1, lastIndexLoaded + 1, streams.home);
        })

        $(document).on('click', 'strong', function(){
          var user = $(this).text().split("@")[1];
          var $back = $('<button class="back">View all Tweets</button>')

          $container.children().html('');
          $button.attr('id', user);
          $container.children('.buttonContainer').append($button, $back);

          loadTweets(streams.users[user].length - 1, 0, streams.users[user]);
          
        });

      });