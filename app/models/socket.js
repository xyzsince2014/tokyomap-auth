const mysql = require("mysql");

const maria = require("../utils/maria");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const getTweets = async () => {
  const con = mysql.createConnection(dbConfig);

  try {
    const records = await maria.query(
      con,
      "SELECT * FROM tweets as t JOIN users AS u ON t.user_id = u.user_id WHERE posted_at > (NOW() + INTERVAL - 90 MINUTE) ORDER BY posted_at LIMIT 100"
    );
    con.end();

    if (!records) {
      return [];
    }

    let tweets = [];
    records.map(rec => {
      tweets.push({
        // todo: validation
        tweetId: rec.tweet_id,
        userId: rec.user_id,
        userName: rec.user_name,
        profileImageUrl: rec.profile_image_url ? rec.profile_image_url : '',
        message: rec.message,
        postedAt: rec.posted_at,
        disappearAt: rec.disappear_at,
        lat: rec.lat,
        lng: rec.lng,
      });
    });
    return tweets;
  } catch (err) {
    throw err;
  }
};

const postTweet = async ({userId, geolocation, message}) => {
    const con = mysql.createConnection(dbConfig);
    try {
      // validate geolocation & message, and thow err if fail
      await maria.beginTransaction(con);
      await maria.query(
        con,
        `INSERT INTO tweets SET user_id = "${userId}", message = "${message}", posted_at = NOW(), disappear_at = (NOW() + INTERVAL 90 MINUTE), lat = ${geolocation[0]}, lng = ${geolocation[1]}`,
      );
      maria.commit(con);
      con.end();
    } catch (err) {
      await maria.rollback(con);
      con.end();
      throw err;
    }
};

module.exports = {
  getTweets,
  postTweet
};
