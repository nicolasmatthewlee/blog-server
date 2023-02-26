// import dotenv from "dotenv";
// dotenv.config();
// import { connect, connection } from "mongoose";
import { readFileSync, createWriteStream } from "fs";
import * as path from "path";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import { Image, imageI } from "./models/image";
import { Article } from "./models/article";

// connect(process.env.mongo ?? "").catch((err: Error) => {
//   throw err;
// });
// connection.on("error", (err: Error) => {
//   if (err) throw err;
// });

const uploadSampleImage = () => {
  const image = new Image({
    filename: "sample.jpg",
    contentType: "image/jpg",
    data: readFileSync(path.join(__dirname, "sample.jpg")),
  });
  image.save((err: Error | null) => {
    if (err) return console.log(err);
    console.log("Image saved.");
  });
};
// uploadSampleImage()

const downloadSampleImage = () => {
  Image.findOne((err: Error, image: imageI) => {
    if (err) return console.log(err);
    const writeStream = createWriteStream("test.jpg");
    writeStream.on("end", () => writeStream.end());
    writeStream.write(image.data);
  });
};
// downloadSampleImage()

const uploadSampleArticle1 = () => {
  const article = new Article({
    title: "The Mighty Lion: Power, Grace, and Conservation",
    textBrief:
      "Lions are one of the most iconic and recognizable animals on the planet, known for their power, grace, and majestic appearance. These big cats are native to Africa and are the second-largest species of big cat, with males weighing up to 550 pounds and females weighing up to 400 pounds. Lions are the only cats that live in groups, known as prides, and they are known for their impressive hunting skills and territorial behavior.",
    author: "Gary Pearson",
    created: new Date(),
    image: readFileSync(path.join(__dirname, "./assets/1.jpg")),
    imageAlt: "a lion in the wild",
    content: [
      { type: "header", text: "Introduction" },
      {
        type: "paragraph",
        text: "Lions are one of the most iconic and recognizable animals on the planet, known for their power, grace, and majestic appearance. These big cats are native to Africa and are the second-largest species of big cat, with males weighing up to 550 pounds and females weighing up to 400 pounds. Lions are the only cats that live in groups, known as prides, and they are known for their impressive hunting skills and territorial behavior.",
      },
      { type: "header", text: "The Biology of Lions" },
      {
        type: "paragraph",
        text: "One of the most striking features of lions is their mane, which is unique to male lions and can range from light to dark brown in color. The mane serves several purposes, including protection during fights with other lions and as a way to attract potential mates. Female lions do not have manes but are still impressive hunters in their own right, relying on stealth and teamwork to take down prey.",
      },
      { type: "header", text: "The Ecology of Lions" },
      {
        type: "paragraph",
        text: "Lions are apex predators, meaning they are at the top of the food chain in their ecosystem. They prey on a variety of animals, including antelopes, zebras, and even elephants, and they are incredibly skilled hunters. Lions use a combination of stealth, speed, and teamwork to take down their prey, with females working together to surround and ambush their target while males provide protection and help with the kill.",
      },
      { type: "header", text: "The Conservation of Lions" },
      {
        type: "paragraph",
        text: "Despite their power and strength, lions are currently facing a number of threats, including habitat loss and poaching. Conservation efforts are underway to help protect these magnificent animals, with measures such as protected habitats and anti-poaching initiatives being implemented in many areas.",
      },
      { type: "header", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Overall, lions are truly remarkable animals, known for their beauty, strength, and impressive hunting skills. While they face significant threats in the wild, ongoing conservation efforts offer hope for the survival of this iconic species for generations to come.",
      },
    ],
  });
  return article
    .save()
    .then((res) => {
      return res._id;
    })
    .catch((err) => {
      return err;
    });
};
// uploadSampleArticle1();

const uploadSampleArticle2 = () => {
  const article = new Article({
    title: "The Science of Cats: Understanding our Feline Friends",
    textBrief:
      "Cats have been beloved pets for thousands of years, but despite our long history with them, there is still so much we have yet to learn about these fascinating creatures. In recent years, scientists have been studying cats more closely, uncovering new insights into their behavior, cognition, and biology. In this article, we will explore some of the latest findings in the science of cats.",
    author: "Daniel Lee",
    created: new Date(),
    image: readFileSync(path.join(__dirname, "./assets/2.jpg")),
    imageAlt: "closeup of a cat in front of trees",
    content: [
      { type: "header", text: "Introduction" },
      {
        type: "paragraph",
        text: "Cats have been beloved pets for thousands of years, but despite our long history with them, there is still so much we have yet to learn about these fascinating creatures. In recent years, scientists have been studying cats more closely, uncovering new insights into their behavior, cognition, and biology. In this article, we will explore some of the latest findings in the science of cats.",
      },
      { type: "header", text: "The Evolution of Cats" },
      {
        type: "paragraph",
        text: "Cats are one of the most successful and diverse groups of mammals on the planet, with over 40 different species ranging from domesticated pets to majestic big cats like lions and tigers. In this section, we will examine the evolutionary history of cats, how they became such effective predators, and how their domestication has shaped their behavior and biology.",
      },
      { type: "header", text: "The Social Lives of Cats" },
      {
        type: "paragraph",
        text: "Cats are often thought of as solitary creatures, but recent research has revealed that they are much more social than we previously thought. In this section, we will explore how cats communicate with each other and with humans, how they form social bonds, and what factors influence their behavior.",
      },
      { type: "header", text: "The Minds of Cats" },
      {
        type: "paragraph",
        text: "Cats are highly intelligent and curious animals, but much of their cognitive abilities remain a mystery. In this section, we will delve into the science of feline cognition, examining their memory, problem-solving skills, and ability to learn and adapt to new situations.",
      },
      { type: "header", text: "The Future of Cats" },
      {
        type: "paragraph",
        text: "Finally, we will look ahead to the future of cats and how our understanding of them is likely to evolve in the coming years. From new genetic technologies to the changing role of cats in our society, we will explore the many ways in which cats are likely to continue to capture our attention and inspire scientific inquiry.",
      },
      { type: "header", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Cats are complex and fascinating animals, and our understanding of them is constantly evolving. By continuing to study and appreciate these remarkable creatures, we can deepen our relationships with them and better appreciate the unique role they play in our lives.",
      },
    ],
  });
  return article
    .save()
    .then((res) => {
      return res._id;
    })
    .catch((err) => {
      return err;
    });
};
// uploadSampleArticle2();

const uploadSampleArticle3 = () => {
  const article = new Article({
    title: "Jaguars: The Mysterious Predators of the Americas",
    textBrief:
      "Jaguars are the largest feline predators in the Americas, but despite their imposing size and strength, they are shrouded in mystery. In this article, we will explore the fascinating world of jaguars, from their behavior and biology to their critical role in the ecosystems of Central and South America.",
    author: "Jeremy Lewis",
    created: new Date(),
    image: readFileSync(path.join(__dirname, "./assets/3.jpg")),
    imageAlt: "a jaguar leaning over a tree branch",
    content: [
      { type: "header", text: "Introduction" },
      {
        type: "paragraph",
        text: "Jaguars are the largest feline predators in the Americas, but despite their imposing size and strength, they are shrouded in mystery. In this article, we will explore the fascinating world of jaguars, from their behavior and biology to their critical role in the ecosystems of Central and South America.",
      },
      { type: "header", text: "The Biology of Jaguars" },
      {
        type: "paragraph",
        text: "Jaguars are renowned for their muscular build, powerful jaws, and distinctive spotted coat. In this section, we will examine the anatomy and physiology of jaguars, including their hunting strategies, reproductive behavior, and the unique adaptations that make them such effective predators.",
      },
      { type: "header", text: "The Ecology of Jaguars" },
      {
        type: "paragraph",
        text: "Jaguars are apex predators, meaning that they play a critical role in the food web of their ecosystems. In this section, we will explore the ecological importance of jaguars, including their interactions with other species, their impact on plant communities, and the challenges they face in a changing environment.",
      },
      { type: "header", text: "The Cultural Significance of Jaguars" },
      {
        type: "paragraph",
        text: "Jaguars have been revered and feared by humans for centuries, with a rich cultural legacy across the Americas. In this section, we will examine the ways in which jaguars have been depicted in indigenous cultures, from their status as symbols of power and protection to their place in spiritual beliefs and storytelling.",
      },
      { type: "header", text: "The Conservation of Jaguars" },
      {
        type: "paragraph",
        text: "Despite their cultural significance and ecological importance, jaguars are facing increasing threats to their survival. In this section, we will look at the challenges facing jaguars today, from habitat loss and fragmentation to hunting and conflict with humans. We will also explore the latest research and conservation efforts aimed at protecting these magnificent animals.",
      },
      { type: "header", text: "The Future of Jaguars" },
      {
        type: "paragraph",
        text: "Finally, we will look ahead to the future of jaguars and the critical role they will continue to play in the ecosystems of the Americas. From the potential impact of climate change to new technologies and approaches to conservation, we will explore the many ways in which we can work to ensure a future for these powerful and mysterious predators.",
      },
      { type: "header", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Jaguars are a testament to the complexity and diversity of life on our planet, and their importance to ecosystems and cultures across the Americas cannot be overstated. By continuing to study and appreciate jaguars, we can deepen our understanding of the natural world and work to ensure that these remarkable animals continue to thrive for generations to come.",
      },
    ],
  });
  article.save((err: Error | null) => {
    if (err) return console.log(err);
    console.log("Article 3 saved.");
  });
};
// uploadSampleArticle3();

const uploadSampleArticle4 = () => {
  const article = new Article({
    title:
      "The Wonders of Deer: Understanding the Science Behind These Graceful Creatures",
    textBrief:
      "Deer are a ubiquitous presence in many parts of the world, but despite their familiarity, they remain fascinating and mysterious creatures. In this article, we will explore the science behind deer, from their behavior and biology to their cultural significance and conservation challenges.",
    author: "Nathan Parker",
    created: new Date(),
    image: readFileSync(path.join(__dirname, "./assets/4.jpg")),
    imageAlt: "closeup on a deer looking towards the photographer",
    content: [
      { type: "header", text: "Introduction" },
      {
        type: "paragraph",
        text: "Deer are a ubiquitous presence in many parts of the world, but despite their familiarity, they remain fascinating and mysterious creatures. In this article, we will explore the science behind deer, from their behavior and biology to their cultural significance and conservation challenges.",
      },
      { type: "header", text: "The Biology of Deer" },
      {
        type: "paragraph",
        text: "Deer are unique and adaptable animals, with a wide variety of species and subspecies spread across the globe. In this section, we will examine the biology of deer, including their anatomy and physiology, hunting strategies, and reproductive behavior.",
      },
      { type: "header", text: "The Ecology of Deer" },
      {
        type: "paragraph",
        text: "Deer play a critical role in many ecosystems, from their impact on plant communities to their interactions with predators and other herbivores. In this section, we will explore the ecological importance of deer, including their role as food sources for predators and their influence on forest dynamics and biodiversity.",
      },
      { type: "header", text: "The Cultural Significance of Deer" },
      {
        type: "paragraph",
        text: "Deer have been an important part of human culture for centuries, from their place in mythology and folklore to their role in hunting and wildlife management. In this section, we will examine the ways in which deer have been depicted in art and literature, as well as their importance to indigenous cultures and hunting traditions.",
      },
      { type: "header", text: "The Conservation of Deer" },
      {
        type: "paragraph",
        text: "Deer face a range of conservation challenges, from habitat loss and fragmentation to hunting and disease. In this section, we will look at the latest research and conservation efforts aimed at protecting deer populations, including habitat restoration, population monitoring, and disease management.",
      },
      { type: "header", text: "The Future of Deer" },
      {
        type: "paragraph",
        text: "Finally, we will look ahead to the future of deer and the many ways in which these remarkable animals will continue to shape the natural world and our understanding of it. From new technologies and approaches to wildlife management to the potential impact of climate change, we will explore the many ways in which we can work to ensure a future for deer and the ecosystems they inhabit.",
      },
      { type: "header", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Deer are a testament to the diversity and complexity of life on our planet, and their importance to ecosystems and cultures around the world cannot be overstated. By continuing to study and appreciate deer, we can deepen our understanding of the natural world and work to ensure that these graceful and fascinating creatures continue to thrive for generations to come.",
      },
    ],
  });
  article.save((err: Error | null) => {
    if (err) return console.log(err);
    console.log("Article 4 saved.");
  });
};
// uploadSampleArticle4();

const uploadSampleArticle5 = () => {
  const article = new Article({
    title:
      "The Fascinating World of Foxes: Understanding Their Behavior and Biology",
    textBrief:
      "Foxes are some of the most intriguing and adaptable animals in the natural world. From their striking appearance to their unique hunting strategies, these cunning creatures have captured the attention of scientists and nature enthusiasts alike. In this article, we will explore the biology and behavior of foxes, shedding light on the many secrets of these captivating creatures.",
    author: "Leonard Percey",
    created: new Date(),
    image: readFileSync(path.join(__dirname, "./assets/6.jpg")),
    imageAlt: "fox standing on a snowbank",
    content: [
      { type: "header", text: "Introduction" },
      {
        type: "paragraph",
        text: "Foxes are some of the most intriguing and adaptable animals in the natural world. From their striking appearance to their unique hunting strategies, these cunning creatures have captured the attention of scientists and nature enthusiasts alike. In this article, we will explore the biology and behavior of foxes, shedding light on the many secrets of these captivating creatures.",
      },
      { type: "header", text: "The Biology of Foxes" },
      {
        type: "paragraph",
        text: "Foxes are a diverse and highly adaptable group of mammals, with over 20 different species found throughout the world. In this section, we will examine the anatomy and physiology of foxes, including their physical characteristics, hunting behavior, and reproductive strategies.",
      },
      { type: "header", text: "The Ecology of Foxes" },
      {
        type: "paragraph",
        text: "As predators, foxes play an important role in the ecosystems in which they live. In this section, we will explore the ecological importance of foxes, including their impact on prey populations, their interactions with other species, and their ability to thrive in a range of different habitats.",
      },
      { type: "header", text: "The Social Behavior of Foxes" },
      {
        type: "paragraph",
        text: "Foxes are highly social animals, living in complex family groups and exhibiting a range of interesting behaviors. In this section, we will delve into the social behavior of foxes, including their communication strategies, territoriality, and the fascinating courtship rituals of some species.",
      },
      { type: "header", text: "The Cultural Significance of Foxes" },
      {
        type: "paragraph",
        text: "Foxes have played a role in human culture for centuries, featuring in mythology, art, and literature from around the world. In this section, we will explore the cultural significance of foxes, including their symbolic meanings in different cultures, as well as the important role they play in hunting traditions and folklore.",
      },
      { type: "header", text: "The Conservation of Foxes" },
      {
        type: "paragraph",
        text: "Many species of fox are facing conservation challenges, including habitat loss, hunting, and disease. In this section, we will examine the latest research and conservation efforts aimed at protecting fox populations, including habitat restoration, population monitoring, and disease management.",
      },
      { type: "header", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Foxes are remarkable animals that continue to capture the attention of scientists and nature enthusiasts around the world. By studying and appreciating these cunning and adaptable creatures, we can deepen our understanding of the natural world and work to ensure a future for foxes and the ecosystems they inhabit.",
      },
    ],
  });
  article.save((err: Error | null) => {
    if (err) return console.log(err);
    console.log("Article 5 saved.");
  });
};
// uploadSampleArticle5();

const uploadSampleArticle6 = () => {
  const article = new Article({
    title:
      "The Enduring Wonders of Sea Turtles: A Look into their Biology, Ecology, and Conservation",
    textBrief:
      "Sea turtles are fascinating creatures that have captured the hearts and minds of people around the world. In this article, we will explore the biology, ecology, and conservation of these remarkable animals, shedding light on the many secrets of their survival in the marine environment.",
    author: "Gary Pearson",
    created: new Date(),
    image: readFileSync(path.join(__dirname, "./assets/7.jpg")),
    imageAlt: "sea turtle swimming through the ocean",
    content: [
      { type: "header", text: "Introduction" },
      {
        type: "paragraph",
        text: "Sea turtles are fascinating creatures that have captured the hearts and minds of people around the world. In this article, we will explore the biology, ecology, and conservation of these remarkable animals, shedding light on the many secrets of their survival in the marine environment.",
      },
      { type: "header", text: "The Biology of Sea Turtles" },
      {
        type: "paragraph",
        text: "Sea turtles are unique and adaptable animals, with a wide range of species spread across the world's oceans. In this section, we will examine the anatomy and physiology of sea turtles, including their physical characteristics, diet, and reproductive behavior.",
      },
      { type: "header", text: "The Ecology of Sea Turtles" },
      {
        type: "paragraph",
        text: "Sea turtles play a critical role in marine ecosystems, from their impact on seagrass and algae to their interactions with predators and other marine life. In this section, we will explore the ecological importance of sea turtles, including their role as food sources for predators and their influence on beach dynamics and biodiversity.",
      },
      { type: "header", text: "The Life Cycle of Sea Turtles" },
      {
        type: "paragraph",
        text: "Sea turtles have a unique life cycle that spans both land and sea, from their hatching on sandy beaches to their migration across the oceans. In this section, we will examine the various stages of the sea turtle life cycle, including their nesting behavior, hatchling emergence, and juvenile and adult survival strategies.",
      },
      { type: "header", text: "The Conservation of Sea Turtles" },
      {
        type: "paragraph",
        text: "Sea turtles face a range of conservation challenges, from habitat loss and pollution to fishing and climate change. In this section, we will look at the latest research and conservation efforts aimed at protecting sea turtle populations, including habitat protection, population monitoring, and the use of technology to track sea turtle movements.",
      },
      { type: "header", text: "The Future of Sea Turtles" },
      {
        type: "paragraph",
        text: "Finally, we will look ahead to the future of sea turtles and the many ways in which these remarkable animals will continue to shape the marine environment and our understanding of it. From new technologies and approaches to marine conservation to the potential impact of climate change, we will explore the many ways in which we can work to ensure a future for sea turtles and the ecosystems they inhabit.",
      },
      { type: "header", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Sea turtles are a testament to the diversity and complexity of life in the marine environment, and their importance to ecosystems and cultures around the world cannot be overstated. By continuing to study and appreciate sea turtles, we can deepen our understanding of the natural world and work to ensure that these fascinating creatures continue to thrive for generations to come.      ",
      },
    ],
  });
  article.save((err: Error | null) => {
    if (err) return console.log(err);
    console.log("Article 6 saved.");
  });
};
// uploadSampleArticle6();

const uploadSampleArticle7 = () => {
  const article = new Article({
    title:
      "Unlocking the Secrets of Cows: A Fascinating Look Into Bovine Behavior and Biology",
    textBrief:
      "Cows, with their big, expressive eyes and gentle demeanor, have captivated people for centuries. These domesticated animals are much more than just a source of food and dairy products; they are complex creatures with fascinating behaviors and intricate biological systems. In this article, we'll take a closer look at what makes cows so special and explore some of the latest research on their anatomy, physiology, and behavior.",
    author: "Jerry Smith",
    created: new Date(),
    image: readFileSync(path.join(__dirname, "./assets/8.jpg")),
    imageAlt: "cow grazing in a meadow",
    content: [
      { type: "header", text: "Look into Bovine Behavior and Biology" },
      {
        type: "paragraph",
        text: "Cows, with their big, expressive eyes and gentle demeanor, have captivated people for centuries. These domesticated animals are much more than just a source of food and dairy products; they are complex creatures with fascinating behaviors and intricate biological systems. In this article, we'll take a closer look at what makes cows so special and explore some of the latest research on their anatomy, physiology, and behavior.",
      },
      { type: "header", text: "Anatomy and Physiology of Cows" },
      {
        type: "paragraph",
        text: "Cows are members of the Bovidae family and belong to the species Bos taurus. They are large mammals, typically weighing between 800 to 1,200 pounds and standing up to six feet tall at the shoulder. They have a distinctive appearance, with a broad head, short legs, and a stocky body.",
      },
      {
        type: "paragraph",
        text: "Cows are known for their impressive digestive system, which is optimized to extract nutrients from tough plant materials such as grasses and hay. They have four stomach compartments – the rumen, reticulum, omasum, and abomasum – that work together to break down and digest their food. Their large intestines are also capable of fermenting cellulose, which is important for digesting tough plant fibers.",
      },
      { type: "header", text: "Behavior and Social Structure" },
      {
        type: "paragraph",
        text: "Cows are social animals that form close bonds with their herd mates. They communicate with each other using a variety of sounds, from low-pitched moos to high-pitched bellows, and they also use body language to convey their emotions and intentions. For example, they may lower their head and tail to show dominance, or they may huddle together to show comfort and security.",
      },
      {
        type: "paragraph",
        text: "In addition to their social behavior, cows are also known for their curiosity and playfulness. They have been observed exploring their environment and playing with objects such as balls and ropes. These behaviors are not only enjoyable for the cows, but they also help to stimulate their minds and improve their overall well-being.",
      },
      { type: "header", text: "Latest Research on Cows" },
      {
        type: "paragraph",
        text: "In recent years, there has been growing interest in the study of cows, particularly their cognitive abilities and emotions. Researchers have found that cows are capable of recognizing and remembering faces and objects, and they also have a strong sense of self-awareness. They are also capable of experiencing emotions such as fear, joy, and anger, and they respond to positive reinforcement such as praise and treats.",
      },
      {
        type: "paragraph",
        text: "In addition to their cognitive and emotional abilities, researchers are also studying the impact of nutrition, genetics, and environment on the health and productivity of cows. For example, scientists are exploring how to improve the quality of feed and reduce the amount of greenhouse gas emissions produced by cows.",
      },
      { type: "header", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Cows are much more than just a source of food and dairy products. They are complex creatures with fascinating behaviors and intricate biological systems. By studying their anatomy, physiology, and behavior, we can gain a deeper understanding of these gentle giants and find ways to improve their lives and well-being.",
      },
    ],
  });
  article.save((err: Error | null) => {
    if (err) return console.log(err);
    console.log("Article 7 saved.");
  });
};
// uploadSampleArticle7();

const uploadSampleArticle8 = () => {
  const article = new Article({
    title:
      "The Secret Lives of Lynxes: Understanding Their Ecology, Behavior, and Conservation",
    textBrief:
      "Lynxes are elusive and enigmatic animals that have captured the attention of scientists and nature enthusiasts around the world. In this article, we will explore the ecology, behavior, and conservation of lynxes, shedding light on the many secrets of these captivating creatures.",
    author: "Daniel Lee",
    created: new Date(),
    image: readFileSync(path.join(__dirname, "./assets/11.jpg")),
    imageAlt: "closeup of a lynx",
    content: [
      { type: "header", text: "Introduction" },
      {
        type: "paragraph",
        text: "Lynxes are elusive and enigmatic animals that have captured the attention of scientists and nature enthusiasts around the world. In this article, we will explore the ecology, behavior, and conservation of lynxes, shedding light on the many secrets of these captivating creatures.",
      },
      { type: "header", text: "The Ecology of Lynxes" },
      {
        type: "paragraph",
        text: "As top predators, lynxes play a critical role in the ecosystems in which they live. In this section, we will explore the ecological importance of lynxes, including their impact on prey populations, their interactions with other species, and their ability to thrive in a range of different habitats.",
      },
      { type: "header", text: "The Behavior of Lynxes" },
      {
        type: "paragraph",
        text: "Lynxes are highly adaptable animals that exhibit a range of interesting behaviors. In this section, we will delve into the behavior of lynxes, including their hunting strategies, communication, and social dynamics. We will also examine the unique characteristics of different species of lynx, including the Eurasian lynx, the Iberian lynx, and the Canadian lynx.",
      },
      { type: "header", text: "The Conservation of Lynxes" },
      {
        type: "paragraph",
        text: "Many species of lynx are facing conservation challenges, including habitat loss, hunting, and disease. In this section, we will examine the latest research and conservation efforts aimed at protecting lynx populations, including habitat restoration, population monitoring, and disease management. We will also explore the challenges facing transboundary populations, including the importance of international collaboration in conservation efforts.",
      },
      { type: "header", text: "The Role of Lynxes in Culture" },
      {
        type: "paragraph",
        text: "Lynxes have played an important role in human culture for centuries, featuring in mythology, art, and literature from around the world. In this section, we will explore the cultural significance of lynxes, including their symbolic meanings in different cultures, as well as the important role they play in hunting traditions and folklore.",
      },
      { type: "header", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Lynxes are remarkable animals that continue to capture the attention of scientists and nature enthusiasts around the world. By studying and appreciating these elusive and adaptable creatures, we can deepen our understanding of the natural world and work to ensure a future for lynxes and the ecosystems they inhabit. Through conservation efforts and international collaboration, we can ensure that these fascinating creatures continue to thrive for generations to come.",
      },
    ],
  });
  article.save((err: Error | null) => {
    if (err) return console.log(err);
    console.log("Article 8 saved.");
  });
};
// uploadSampleArticle8();

export {
  uploadSampleArticle1,
  uploadSampleArticle2,
  uploadSampleArticle3,
  uploadSampleArticle4,
  uploadSampleArticle5,
  uploadSampleArticle6,
  uploadSampleArticle7,
  uploadSampleArticle8,
};
