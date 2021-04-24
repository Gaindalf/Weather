const API = 'https://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=fc18bd97e2c3971da9f9239631ab09db';
const APIDaily = 'https://api.openweathermap.org/data/2.5/onecall?lat=51.5097&lon=-0.1256&units=metric&appid=fc18bd97e2c3971da9f9239631ab09db';

class Weather {
    constructor(container = '.weather') {
        this.container = container;
        this.weather = [];
        this.dailyWeather = [];
        this._getWeather()
            .then(data => {
                //console.log(data);
                this.weather = [...data.list];
                this.getPressure();
                this._getDailyWeather();
            });
    }

    _getWeather() {
        return fetch(`${API}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    _getDailyWeather() {
        let mornTemp = 0;
        let nightTemp = 0;
        let differenceBetweenMinAndMaxTemp = 100;
        let dateForMinDifBetweenTemp = 0;
        return fetch(`${APIDaily}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
            .then(data => {
                this.dailyWeather = [...data.daily];
                for (let i = 0; i < 5; i++) {
                    mornTemp = +this.dailyWeather[i].temp.morn;
                    nightTemp = +this.dailyWeather[i].temp.night;
                    console.log("Температура утром: " + mornTemp);
                    console.log("Температура ночью: " + nightTemp);
                    if (differenceBetweenMinAndMaxTemp > (Math.abs(mornTemp - nightTemp))) {
                        differenceBetweenMinAndMaxTemp = (Math.abs(mornTemp - nightTemp));
                        dateForMinDifBetweenTemp = +this.dailyWeather[i].dt + "000";
                    }
                }
                console.log("Минимальная разница температуры утром и ночью: " + parseFloat(differenceBetweenMinAndMaxTemp).toFixed(2) + "C");
                console.log(this.timestampToDate(dateForMinDifBetweenTemp));
            });
    }

    timestampToDate(ts) {
        let d = new Date();
        d.setTime(ts);
        return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
    }

    getPressure() {
        let maxPressure = 10;
        let dateOfmaxPressure = "";
        for (let i = 0; i < this.weather.length; i++) {
            if (this.weather[i].main.pressure > maxPressure) {
                maxPressure = this.weather[i].main.pressure;
                dateOfmaxPressure = this.weather[i].dt_txt;
            }
        }
        console.log("Показатели погоды для города Лондон, Великобритания");
        console.log("Максимальное давление: " + maxPressure + " Pa");
        console.log("Максимальное давление будет в это время: " + dateOfmaxPressure);
    }
}
let weather = new Weather();
