import request from 'request';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import User from '../../models/user.js';
import courseResponseEnum from "../../utils/enums/courseResponseEnum.js";
import entityRepository from '../../data/repositories/entity.repository.js';
import categoryRepository from "../../data/repositories/category.repository.js";
import subscriberRepository from "../../data/repositories/subscriber.repository.js";
import categoryResponseEnum from "../../utils/enums/categoryResponseEnum.js";
import courseRepository from "../../data/repositories/course.repository.js";
const userRepository = entityRepository(User);


const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const chatbotService = {
  async postWebHook(req, res) {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);


        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }

      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  },

  async getWebHook(req, res) {

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);

      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  },

  async setupProfile(req, res) {
    // Construct the message body
    let request_body = {
      "get_started": { "payload": "GET_STARTED" },
      "whitelisted_domains": ["https://academy--web.herokuapp.com/"]
    }

    // Send the HTTP request to the Messenger Platform
    request({
      "uri": `https://graph.facebook.com/v11.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      console.log("####");
      console.log(request_body);
      console.log("#####");
      console.log(body);
      if (!err) {
        console.log('Setup user profile succeeded!');
      } else {
        console.error("Unable to setup profile:" + err);
      }
    });
  },

  async setupPersistentMenu(req, res) {
    // Construct the message body
    let request_body = {
      "persistent_menu": [{
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [{
          "type": "postback",
          "title": "Restart chatbot",
          "payload": "RESTART_CHATBOT"
        }]
      }]
    }

    // Send the HTTP request to the Messenger Platform
    request({
      "uri": `https://graph.facebook.com/v11.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      console.log("####");
      console.log(request_body);
      console.log("#####");
      console.log(body);
      if (!err) {
        console.log('Setup persistent menu succeeded!');
      } else {
        console.error("Unable to setup persistent menu:" + err);
      }
    });
  },

  async getCoursesByCategoryId(request) {
    try {
      const category = await categoryRepository.getOneById(request.id);
      if (!category) {
        return {
          code: categoryResponseEnum.CATEGORY_ID_IS_INVALID
        }
      }
      if (!category.status) {
        return {
          code: categoryResponseEnum.CATEGORY_HAS_BEEN_DELETED
        }
      }
      let courses = await courseRepository.getAllByCategoryId({ category_id: request.id, status: true });
      courses = JSON.parse(JSON.stringify(courses));
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getSubscribersByCourseId = {},
        getPoint = {};

      users.forEach(element => {
        getUserById[element._id] = element;
      });

      categories.forEach(element => {
        getCategoryById[element._id] = element;
      });

      subscribers.forEach(element => {
        if (getSubscribersByCourseId && getSubscribersByCourseId[element.course_id])
          getSubscribersByCourseId[element.course_id] += 1;
        else
          getSubscribersByCourseId[element.course_id] = 1;
      });

      let num = {};
      subscribers.forEach(element => {
        if (getPoint && getPoint[element.course_id]) {
          if (element.rating > 0) {
            getPoint[element.course_id] += element.rating;
            num[element.course_id]++;
          }
        } else {
          if (element.rating > 0) {
            getPoint[element.course_id] = element.rating;
            num[element.course_id] = 1;
          } else {
            getPoint[element.course_id] = 0;
          }
        }
      })
      const ids = Object.keys(getPoint);
      ids.forEach(element => {
        getPoint[element] /= num[element];
      })

      let tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        courses[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courses[i].price);
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
        courses[i]['number_of_subscribers'] = getSubscribersByCourseId[tmp[i]._id] ? getSubscribersByCourseId[tmp[i]._id] : 0;
        courses[i]['point'] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
      }

      return {
        code: courseResponseEnum.SUCCESS,
        courses: tmp,
      }
    } catch (e) {
      return {
        code: courseResponseEnum.SERVER_ERROR
      }
    }
  },

  async getCoursesByName(request) {
    try {
      let courses = await courseRepository.getAllByName(request.keyword);
      courses = JSON.parse(JSON.stringify(courses));
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getSubscribersByCourseId = {},
        getPoint = {};

      users.forEach(element => {
        getUserById[element._id] = element;
      });

      categories.forEach(element => {
        getCategoryById[element._id] = element;
      });

      subscribers.forEach(element => {
        if (getSubscribersByCourseId && getSubscribersByCourseId[element.course_id])
          getSubscribersByCourseId[element.course_id] += 1;
        else
          getSubscribersByCourseId[element.course_id] = 1;
      });

      let num = {};
      subscribers.forEach(element => {
        if (getPoint && getPoint[element.course_id]) {
          if (element.rating > 0) {
            getPoint[element.course_id] += element.rating;
            num[element.course_id]++;
          }
        } else {
          if (element.rating > 0) {
            getPoint[element.course_id] = element.rating;
            num[element.course_id] = 1;
          } else {
            getPoint[element.course_id] = 0;
          }
        }
      })
      const ids = Object.keys(getPoint);
      ids.forEach(element => {
        getPoint[element] /= num[element];
      })

      let tmp = courses;
      const date = new Date();
      for (var i = 0; i < tmp.length; i++) {
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
        courses[i]['number_of_subscribers'] = getSubscribersByCourseId[tmp[i]._id] ? getSubscribersByCourseId[tmp[i]._id] : 0;
        courses[i]['point'] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
        courses[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courses[i].price);

      }

      return {
        code: courseResponseEnum.SUCCESS,
        courses: tmp,
      }
    } catch (e) {
      return {
        code: courseResponseEnum.SERVER_ERROR
      }
    }
  },
}

// Handles messages events
const handleMessage = async(sender_psid, received_message) => {

  let response;

  // Check if the message contains text
  if (received_message.text) {
    if (received_message.text.includes("KH: ")) {
      handleCoursesByNameForMessage(received_message, sender_psid);
    } else {
      // Create the payload for a basic text message
      response = sendGetStartedMenu();

      // Sends the response message
      callSendAPI(sender_psid, response);
    }
  }

}

// Handles messaging_postbacks events
const handlePostback = async(sender_psid, received_postback) => {

  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  if (payload.includes("CATEGORY: ")) {
    handleCoursesByCategoryId(payload, sender_psid);
  } else if (payload.includes("COURSE: ")) {
    handleCourseByCategoryId(payload, sender_psid);
  } else if (payload.includes("COURSE_BY_NAME: ")) {
    handleCourseByName(payload, sender_psid);
  } else if (payload.includes("COURSES_BY_NAME: ")) {
    handleCoursesByNameForPostBack(payload, sender_psid);
  } else {
    switch (payload) {
      case 'SEARCH':
        response = { "text": `Hãy nhập cú pháp ${"KH: <Từ khóa cần tìm>"}!` }
        callSendAPI(sender_psid, response);
        break;
      case 'CATEGORY':
        handleCategories(sender_psid);
        break;
      case 'RESTART_CHATBOT':
      case 'GET_STARTED':
        handleGetStarted(sender_psid);
        break;
      default:
        response = { "text": `Tôi không hiểu yêu cầu ${payload} của bạn` }
          // Send the message to acknowledge the postback
        callSendAPI(sender_psid, response);
    }
  }
}

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    console.log(request_body);
    console.log(body);
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

const sendGetStartedMenu = () => {
  return {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Khóa học trực tuyến",
          "subtitle": "Dưới đây là các lựa chọn của khóa học",
          "buttons": [{
              "type": "postback",
              "title": "Tìm kiếm khóa học",
              "payload": "SEARCH",
            },
            {
              "type": "postback",
              "title": "Duyệt khóa học",
              "payload": "CATEGORY",
            },
          ],
        }]
      }
    }
  }
}

const handleGetStarted = async(sender_psid) => {
  try {
    let response, response2;
    response = { "text": `Chào mừng bạn đến với khóa học trực tuyến` }
    response2 = sendGetStartedMenu();
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
    callSendAPI(sender_psid, response2);
  } catch (e) {
    console.log(e);
  }
}

const handleCategories = async(sender_psid) => {
  let response;
  const result = await axios.get('https://academy--web.herokuapp.com/api/chatbot-controller/categories');
  const data = result.data;
  if (data.code !== categoryResponseEnum.SUCCESS) {
    response = { "text": "Không phản hồi, vui lòng thử lại" }
  } else if (data.categories.length === 0) {
    response = { "text": "Không thể tải danh mục, vui lòng thử lại" }
  } else {
    const categories = data.categories;
    const buttons = [];
    categories.map((item) => {
      buttons.push({
        "type": "postback",
        "title": item.name,
        "payload": `CATEGORY: ${item._id}`
      });
    })
    const sliceButtonArray = [];
    const chunk = 3;
    if (buttons.length > 33) {
      for (var i = 0; i < 33; i += chunk) {
        sliceButtonArray.push(buttons.slice(i, i + chunk));
      }
    } else {
      for (var i = 0; i < buttons.length; i += chunk) {
        sliceButtonArray.push(buttons.slice(i, i + chunk));
      }
    }
    const elements = [];
    sliceButtonArray.map((item) => {
      item = JSON.stringify(item);
      elements.push({
        "title": "Danh mục khóa học",
        "subtitle": "Dưới đây là các danh mục",
        "buttons": `${item}`,
      })
    })

    const jsonString = JSON.stringify(elements);
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": `${jsonString}`
        }
      }
    }
  }
  callSendAPI(sender_psid, response);
}

const handleCoursesByCategoryId = async(payload, sender_psid) => {
  let response;
  const category_id = payload.substr(10);
  const result = await axios.get(`https://academy--web.herokuapp.com/api/chatbot-controller/courses/${category_id}`);
  const data = result.data;
  if (data.code !== categoryResponseEnum.SUCCESS) {
    response = { "text": "Không phản hồi, vui lòng thử lại" }
  } else if (data.courses.length === 0) {
    response = { "text": "Không tìm thấy khóa học" }
  } else {
    const courses = data.courses;
    const elements = [];
    courses.map((item) => {
      elements.push({
        "title": item.name,
        "subtitle": item.description,
        "buttons": [{
          "type": "postback",
          "title": "Xem chi tiết",
          "payload": `COURSE: ${item._id}`
        }]
      });
    });

    let jsonString;
    if (elements.length > 11) {
      const sliceElements = elements.slice(0, 11)
      jsonString = JSON.stringify(sliceElements);

    } else {
      jsonString = JSON.stringify(elements);
    }
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": `${jsonString}`
        }
      }
    }
  }
  callSendAPI(sender_psid, response);
}

const handleCourseByCategoryId = async(payload, sender_psid) => {
  let response;
  const course_id = payload.substr(8);
  const result = await axios.get(`https://academy--web.herokuapp.com/api/course-controller/course/${course_id}`);
  const data = result.data;
  if (data.code !== categoryResponseEnum.SUCCESS) {
    response = { "text": "Không phản hồi, vui lòng thử lại" }
  } else {
    const course = data.course;
    const elements = [];
    elements.push({
      "title": course.name,
      "subtitle": `${course.description} | Giảng viên: ${course.teacher_name} | Giá: ${course.price} | Lượt xem: ${course.views}`,
      "buttons": [{
        "type": "postback",
        "title": "Quay trở lại",
        "payload": `CATEGORY: ${course.category_id}`
      }]
    });
    const jsonString = JSON.stringify(elements);
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": `${jsonString}`
        }
      }
    }
  }
  callSendAPI(sender_psid, response);
}

const handleCoursesByNameForMessage = async(received_message, sender_psid) => {
  let response;
  const keyword = received_message.text.substr(4);
  const result = await axios.get(`https://academy--web.herokuapp.com/api/chatbot-controller/search?keyword=${keyword}`);
  const data = result.data;
  if (data.code !== categoryResponseEnum.SUCCESS) {
    response = { "text": "Không phản hồi, vui lòng thử lại" }
  } else if (data.courses.length === 0) {
    response = { "text": "Không tìm thấy khóa học" }
  } else {
    const courses = data.courses;
    const elements = [];
    courses.map((item) => {
      elements.push({
        "title": item.name,
        "subtitle": item.description,
        "buttons": [{
          "type": "postback",
          "title": "Xem chi tiết",
          "payload": `COURSE_BY_NAME: ${item._id}: ${keyword}`
        }]
      });
    });

    let jsonString = null;
    if (elements.length > 11) {
      const sliceElements = elements.slice(0, 11)
      jsonString = JSON.stringify(sliceElements);

    } else {
      jsonString = JSON.stringify(elements);
    }
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": `${jsonString}`
        }
      }
    }
  }
  // Sends the response message
  callSendAPI(sender_psid, response);
}

const handleCourseByName = async(payload, sender_psid) => {
  let response;
  const array = payload.split(": ");
  const result = await axios.get(`https://academy--web.herokuapp.com/api/course-controller/course/${array[1]}`);
  const data = result.data;
  if (data.code !== categoryResponseEnum.SUCCESS) {
    response = { "text": "Không phản hồi, vui lòng thử lại" }
  } else {
    const course = data.course;
    const elements = [];
    elements.push({
      "title": course.name,
      "subtitle": `${course.description} | Giảng viên: ${course.teacher_name} | Giá: ${course.price} | Lượt xem: ${course.views}`,
      "buttons": [{
        "type": "postback",
        "title": "Quay trở lại",
        "payload": `COURSES_BY_NAME: ${array[2]}`
      }]
    });
    const jsonString = JSON.stringify(elements);
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": `${jsonString}`
        }
      }
    }
  }
  callSendAPI(sender_psid, response);
}

const handleCoursesByNameForPostBack = async(payload, sender_psid) => {
  let response;
  const keyword = payload.substr(9);
  const result = await axios.get(`https://academy--web.herokuapp.com/api/chatbot-controller/search?keyword=${keyword}`);
  const data = result.data;
  if (data.code !== categoryResponseEnum.SUCCESS) {
    response = { "text": "Không phản hồi, vui lòng thử lại" }
  } else {
    const courses = data.courses;
    const elements = [];
    courses.map((item) => {
      elements.push({
        "title": item.name,
        "subtitle": item.description,
        "buttons": [{
          "type": "postback",
          "title": "Xem chi tiết",
          "payload": `COURSE_BY_NAME: ${item._id}: ${keyword}`
        }]
      });
    });

    let jsonString = null;
    if (elements.length > 11) {
      const sliceElements = elements.slice(0, 11)
      jsonString = JSON.stringify(sliceElements);

    } else {
      jsonString = JSON.stringify(elements);
    }
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": `${jsonString}`
        }
      }
    }
  }
  // Sends the response message
  callSendAPI(sender_psid, response);
}


export default chatbotService;