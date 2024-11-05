const fs = require('fs')

// console.log(fs)

const json = {
    posts: {
        chapter_1: "20240101",
        chapter_2: "20240102",
        chapter_3: "20240103",
        chapter_4: "20240104",
        folder1: {
            chapter_5: "20240105",
            chapter_6: "20240106",
            chapter_7: "20240107",
            chapter_8: "20240108",
            chapter_9: "20240109",
        },
        folder2: {
            chapter_10: "20240110",
            chapter_11: "20240111",
            chapter_12: "20240112",
            chapter_13: "20240113",
        }
    },
    main: ""
}

fs.writeFile('_markdown/index.json', JSON.stringify(json), (err) => {
    console.log(err)
})

