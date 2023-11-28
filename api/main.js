const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Pocketbase = require('pocketbase/cjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

app.get('/api/stats', async (req, res) => {
    try {
        const pb = new Pocketbase("http://127.0.0.1:8090");
        // first day of current month
        const date = new Date();
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        const data = await pb.collection('code_time').getFullList({
            sort: "event_time",
            filter: "event_time >= " + date.getTime()
        });
        const groupByDate = {};
        for (const item of data) {
            const date = new Date(item.event_time);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const dateKey = date.toISOString();
            if (!groupByDate[dateKey]) {
                groupByDate[dateKey] = [];
            }
            groupByDate[dateKey].push(item);
        }

        res.send({
            status: "ok",
            data: Object.entries(groupByDate).map(([date, items]) => ({
                time: date,
                duration: items.length * 1000 * 60
            })),
            message: "success",
        })
    } catch (e) {
        res.status(500);
        res.send({
            status: "error",
            data: [],
            message: e.message,
        })
    }
})

app.post("/api/eventLog", async (req, res) => {
    try {
        const pb = new Pocketbase("http://127.0.0.1:8090");
        data = req.body

        data.eventTime = Math.floor(Date.now() / 60000) * 60000

        const lastData = await pb.collection('code_time').getList(1, 1, {
            sort: "event_time",
            filter: `event_time = ${data.eventTime}`,
        });

        if (lastData.totalItems === 0) {
            pb.collection('code_time').create({
                project: data.project,
                language: data.language,
                event_time: data.eventTime,
                relative_file: data.relativeFile,
            });

            language = await pb.collection('code_time_languages').getList(1, 1, {
                sort: "name",
                filter: `name = '${data.language}'`,
            });

            if (language.totalItems === 0) {
                pb.collection('code_time_languages').create({
                    name: data.language,
                    duration: 1,
                });
            } else {
                pb.collection('code_time_languages').update(language.items[0].id, {
                    duration: language.items[0].duration + 1,
                });
            }

            project = await pb.collection('code_time_projects').getList(1, 1, {
                sort: "name",
                filter: `name = '${data.project}'`,
            });

            if (project.totalItems === 0) {
                pb.collection('code_time_projects').create({
                    name: data.project,
                    duration: 1,
                });
            } else {
                pb.collection('code_time_projects').update(project.items[0].id, {
                    duration: project.items[0].duration + 1,
                });
            }
        }

        res.send({
            status: "ok",
            data: [],
            message: "success",
        });
    } catch (e) {
        res.status(500);
        res.send({
            status: "error",
            message: e.message,
        })
    }
})

app.get("/api/activities", async (req, res) => {
    try {
        const pb = new Pocketbase("http://127.0.0.1:8090");

        const year = req.query.year || new Date().getFullYear();

        const firstDayOfYear = new Date();
        firstDayOfYear.setMonth(0);
        firstDayOfYear.setDate(1);
        firstDayOfYear.setHours(0);
        firstDayOfYear.setMinutes(0);
        firstDayOfYear.setSeconds(0);
        firstDayOfYear.setFullYear(year);

        const lastDayOfYear = new Date();
        lastDayOfYear.setMonth(11);
        lastDayOfYear.setDate(31);
        lastDayOfYear.setHours(23);
        lastDayOfYear.setMinutes(59);
        lastDayOfYear.setSeconds(59);
        lastDayOfYear.setFullYear(year);

        const data = await pb.collection('code_time').getFullList({
            sort: "event_time",
            filter: `event_time >= ${firstDayOfYear.getTime()} && event_time <= ${lastDayOfYear.getTime()}`
        });

        const groupByDate = {};

        for (const item of data) {
            const date = new Date(item.event_time);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            if (!groupByDate[dateKey]) {
                groupByDate[dateKey] = [];
            }
            groupByDate[dateKey].push(item);
        }

        const final = Object.entries(groupByDate).map(([date, items]) => ({
            date: date,
            count: items.length,
            level: (() => {
                const hours = items.length / 60;
                if (hours < 1) {
                    return 1;
                } else if (1 <= hours && hours < 3) {
                    return 2;
                } else if (3 <= hours && hours < 5) {
                    return 3;
                } else {
                    return 4;
                }
            })()
        }));

        if (final[0].date !== `${firstDayOfYear.getFullYear()
            }-${String(firstDayOfYear.getMonth() + 1).padStart(2, '0')
            }-${String(firstDayOfYear.getDate()).padStart(2, '0')}`) {
            final.unshift({
                date: `${firstDayOfYear.getFullYear()
                    }-${String(firstDayOfYear.getMonth() + 1).padStart(2, '0')
                    }-${String(firstDayOfYear.getDate()).padStart(2, '0')}`,
                count: 0,
                level: 0,
            });
        }

        if (final[final.length - 1].date !== `${lastDayOfYear.getFullYear()
            }-${String(lastDayOfYear.getMonth() + 1).padStart(2, '0')
            }-${String(lastDayOfYear.getDate()).padStart(2, '0')}`) {
            final.push({
                date: `${lastDayOfYear.getFullYear()
                    }-${String(lastDayOfYear.getMonth() + 1).padStart(2, '0')
                    }-${String(lastDayOfYear.getDate()).padStart(2, '0')}`,
                count: 0,
                level: 0,
            });
        }

        const firstRecordEver = await pb.collection('code_time').getList(1, 1, {
            sort: "+event_time",
        });

        res.send({
            status: "ok",
            data: {
                data: final,
                firstYear: new Date(firstRecordEver.items[0].event_time).getFullYear(),
            },
            message: "success",
        });
    } catch (e) {
        res.status(500);
        res.send({
            status: "error",
            data: [],
            message: e.message,
        })
    }
})

app.get("/api/statistics", async (req, res) => {
    try {
        const pb = new Pocketbase("http://127.0.0.1:8090");

        const everything = await pb.collection('code_time').getFullList({
            sort: "event_time",
        });

        let groupByDate = {};

        for (const item of everything) {
            const date = new Date(item.event_time);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            if (!groupByDate[dateKey]) {
                groupByDate[dateKey] = 0;
            }
            groupByDate[dateKey] += 1;
        }

        groupByDate = Object.entries(groupByDate).map(([date, count]) => ({
            date,
            count,
        }));

        groupByDate = groupByDate.sort((a, b) => {
            if (a.count > b.count) {
                return -1;
            } else if (a.count < b.count) {
                return 1;
            } else {
                return 0;
            }
        });

        const mostTimeSpent = groupByDate[0].count;
        const total = everything.length;
        const average = total / groupByDate.length;

        groupByDate = groupByDate.sort((a, b) => {
            return a.date.localeCompare(b.date);
        });

        const allDates = groupByDate.map((item) => item.date);

        const longestStreak = (() => {
            let streak = 0;
            let longest = 0;

            const firstDate = new Date(allDates[0]);
            const lastDate = new Date(allDates[allDates.length - 1]);

            const dates = getDates(firstDate, lastDate);

            for (const date of dates) {
                const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                if (allDates.includes(dateKey)) {
                    streak += 1;
                } else {
                    if (streak > longest) {
                        longest = streak;
                    }
                    streak = 0;
                }
            }
            return longest;
        })();

        groupByDate = groupByDate.reverse();

        const currentStreak = (() => {
            let streak = 0;

            const firstDate = new Date(allDates[0]);
            const lastDate = new Date(allDates[allDates.length - 1]);

            const dates = getDates(firstDate, lastDate).reverse();

            for (const date of dates) {
                const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                if (allDates.includes(dateKey)) {
                    streak += 1;
                } else {
                    break
                }
            }
            return streak;
        })();

        res.send({
            status: "ok",
            data: {
                "Most time spent": mostTimeSpent,
                "Total time spent": total,
                "Average time spent": average,
                "Longest streak": longestStreak,
                "Current streak": currentStreak,
            },
            message: "success",
        });
    } catch (e) {

        res.status(500);
        res.send({
            status: "error",
            data: [],
            message: e.message,
        })
    }
})

app.get("/api/projects", async (req, res) => {
    try {
        const pb = new Pocketbase("http://127.0.0.1:8090");

        const lastXDays = req.query.last || "24 hours";

        if (lastXDays > 30) {
            res.status(400);

            res.send({
                status: "error",
                message: "lastXDays must be less than 30",
            });
            return;
        }

        const date = new Date();
        switch (lastXDays) {
            case "24 hours":
                date.setHours(date.getHours() - 24);
                date.setMinutes(0);
                date.setSeconds(0);
                break;
            case "7 days":
                date.setDate(date.getDate() - 7);
                break;
            case "30 days":
                date.setDate(date.getDate() - 30);
                break;
            default:
                date.setDate(date.getDate() - 7);
                break;
        }

        const data = await pb.collection('code_time').getFullList({
            filter: `event_time >= ${date.getTime()}`,
        });

        let groupByProject = {};

        for (const item of data) {
            if (!groupByProject[item.project]) {
                groupByProject[item.project] = 0;
            }
            groupByProject[item.project]++;
        }

        groupByProject = Object.fromEntries(
            Object.entries(groupByProject).sort(([, a], [, b]) => b - a)
        );

        res.send({
            data: groupByProject,
        })
    } catch (e) {
        res.status(500);
        res.send({
            status: "error",
            data: [],
            message: e.message,
        })
    }
})

app.get("/api/languages", async (req, res) => {
    try {
        const pb = new Pocketbase("http://127.0.0.1:8090");

        const lastXDays = req.query.last || "24 hours";

        if (lastXDays > 30) {
            res.status(400);

            res.send({
                status: "error",
                message: "lastXDays must be less than 30",
            });
            return;
        }

        const date = new Date();
        switch (lastXDays) {
            case "24 hours":
                date.setHours(date.getHours() - 24);
                date.setMinutes(0);
                date.setSeconds(0);
                break;
            case "7 days":
                date.setDate(date.getDate() - 7);
                break;
            case "30 days":
                date.setDate(date.getDate() - 30);
                break;
            default:
                date.setDate(date.getDate() - 7);
                break;
        }

        const data = await pb.collection('code_time').getFullList({
            filter: `event_time >= ${date.getTime()}`,
        });

        let groupByLanguage = {};

        for (const item of data) {
            if (!groupByLanguage[item.language]) {
                groupByLanguage[item.language] = 0;
            }
            groupByLanguage[item.language]++;
        }

        groupByLanguage = Object.fromEntries(
            Object.entries(groupByLanguage).sort(([, a], [, b]) => b - a)
        );

        res.send({
            data: groupByLanguage,
        })
    } catch (e) {
        res.status(500);
        res.send({
            status: "error",
            data: [],
            message: e.message,
        })
    }
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})