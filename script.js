var brTacnih = [0, 0, 0];
var izgenerisanaPitanja = [];
var trenutnaOblast = "OpsteObrazovanje";
var izabranNivo = 0;
var datOdgovor = 0;
var trenutnoPitanje = 0;
var trenutniPredmet = 0; // 0 - prvi, 2 - poslednji (za set)
var indeksTacnog = -1;
var pitanjeSet = 0;
var brKlik = 1;
var images = ["no_bonus.png","level1.png", "level2.png", "level3.png", "level4.png"];
var ocene = ["jedinica.png", "dvojka.png", "trojka.png", "cetvortka.png", "petica.png"];
var background = new Audio("audio/background_music.mp3");
var bell_ring = new Audio("audio/bell.mp3");
var sound_on = 0;

// json read go

// kada generise pitanje stavlja datOdgovor na 0

function init(){
    brTacnih = [0, 0, 0]
    trenutnoPitanje = 0;
}

function start_game(){
    document.getElementById("main_menu").style.display = "none";
    document.getElementById("level_choices").style.display = "block";
}

function backToMain(){
    document.getElementById("main_menu").style.display = "block";
    document.getElementById("pomoc").style.display = "none";
    document.getElementById("level_choices").style.display = "none";
}

function ontoPomoc(){
    document.getElementById("main_menu").style.display = "none";
    document.getElementById("pomoc").style.display = "block";
}

function toggle_sound(clicked){
    if(sound_on){
        // on
        background.pause();
        background.currentTime = 0;
        clicked.src="images/sound.png";
        sound_on = 0;
    }
    else{
        // off
        background.play();
        background.loop = true;
        clicked.src="images/no_sound.png";
        sound_on = 1;
    }
}

function imaBonus(){
    var sum = 0;
    for(var i = 0; i < 3; i++)
        sum += brTacnih[i];
    var prosek = sum / 3;
    
    var slika_src = "images/";
    if(prosek >= 4.0){
        switch(izabranNivo){
            case 1:
                slika_src += images[1];
                break;
            case 2:
                slika_src += images[2];
                break;
            case 3:
                slika_src += images[3];
                break;
            case 4:
                slika_src += images[4];
                break;
            default:
                alert("ERR");
                break;
        }
    }
    else
        slika_src += images[0];
        
    var procenat = parseInt(prosek * 20);
    
    document.getElementById("procenti").innerHTML = procenat + "%";
    document.getElementById("bonus").setAttribute("src", slika_src);
        
}

function izgenerisiPitanje(){
    if(trenutnoPitanje != 15){
        datOdgovor = -1;
        brKlik = 0;
        
        var pit = document.getElementById("question_text");
        var odg1 = document.getElementById("odgovor1");
        var odg2 = document.getElementById("odgovor2");
        var odg3 = document.getElementById("odgovor3");
        var tacOdgovor = document.getElementById("odg_sadrzaj");
        var pitanjeOd = document.getElementById("q_od");
    
        if(pitanjeSet == 5){
            izgenerisanaPitanja = [];
            trenutniPredmet += 1;
            pitanjeSet = 0;
        }
        
        pitanjeOd.innerHTML = "Питање " + (trenutnoPitanje + 1) +  " од 15:";
        
        var idPitanja = Math.floor(Math.random() * 8);
        while (izgenerisanaPitanja.includes(idPitanja))
            idPitanja = Math.floor(Math.random() * 8);
        izgenerisanaPitanja.push(idPitanja);
        
        var pitanjaOblasti = setujPredmet();
    
        var tren = pitanjaOblasti[idPitanja];
        
        pit.innerHTML = tren.TekstPitanja;
        odg1.innerHTML = tren.PonudjeniOdgovori.Odgovor0;
        odg2.innerHTML = tren.PonudjeniOdgovori.Odgovor1;
        odg3.innerHTML = tren.PonudjeniOdgovori.Odgovor2;
        
        indeksTacnog = -1;
        if (tren.IndeksTacnogOdgovora == "0") {
            indeksTacnog = 0;
            tacOdgovor = tren.PonudjeniOdgovori.Odgovor0;
        }
        else if (tren.IndeksTacnogOdgovora == "1") {
            indeksTacnog = 1;
            tacOdgovor = tren.PonudjeniOdgovori.Odgovor1;
        }
        else {
            indeksTacnog = 2;
            tacOdgovor = tren.PonudjeniOdgovori.Odgovor2;
        }
        trenutnoPitanje += 1;
        pitanjeSet += 1;
        
    }
    else{
        prikaziRezultat();
    }
}

function izaberiOdgovor(clicked){
    document.getElementById("odgovor1").style.backgroundColor = "white";
    document.getElementById("odgovor2").style.backgroundColor = "white";
    document.getElementById("odgovor3").style.backgroundColor = "white";
    clicked.style.backgroundColor = "gray";
    var str = clicked.id;
    datOdgovor = parseInt(str[str.length - 1]) - 1;
}

function potvrdiOdgovor(){
    if(datOdgovor == -1)
        return;
    if(brKlik){
        // Drugi put kliknem
        document.getElementById("odgovor1").style.backgroundColor = "white";
        document.getElementById("odgovor2").style.backgroundColor = "white";
        document.getElementById("odgovor3").style.backgroundColor = "white";
        document.getElementById("confirm_button").innerHTML = "Потврди одговор";
        document.getElementById("tacan").style.display = "none";
        
        izgenerisiPitanje();
        brKlik = 0;
    }
    else{
        // Prvi put kliknem
        document.getElementById("confirm_button").innerHTML = "Следеће питање";
        document.getElementById("tacan").style.display = "block";
        var novi_odg = document.getElementById("odg_sadrzaj");
        var odg_tac = "odgovor" + (indeksTacnog + 1);
        novi_odg.innerHTML = document.getElementById(odg_tac).innerHTML;
        
        if(datOdgovor == indeksTacnog){
            document.getElementById("naslov_tac").style.color = "green";
            //brTacnih[predmet] += 1;
            if(trenutniPredmet % 3 == 0)
                brTacnih[0] += 1;
            else if(trenutniPredmet % 3 == 1)
                brTacnih[1] += 1;
            else
                brTacnih[2] += 1;
            
        
        }
        else{
            document.getElementById("naslov_tac").style.color = "red";
        }
        
        //var odgovor_tac = "odgovor" + (indeksTacnog + 1);
        //document.getElementById("odg_sadrzaj").innerHTML = document.getElementById("odgovor_tac").innerHTML;
        
        brKlik = 1;
    }
}

function zapocniNivo(){
    var trenPitanje = 0;
    brTacnih = [0, 0, 0]
    trenutnoPitanje = 0;
    pitanjeSet = 0;
    
    var bckg = document.getElementsByTagName("body")[0].style;
    
    if(trenutniPredmet == 0){
        bckg.backgroundColor = "#a474d7"; // pink
    }
    else if(trenutniPredmet == 3){
        bckg.backgroundColor = "#3b9beb"; // blue
    }
    else if(trenutniPredmet == 6){
        bckg.backgroundColor = "#89d927"; // pink
    }
    else{
        bckg.backgroundColor = "#e8af1e"; // pink
    }
    
    izgenerisiPitanje();
    
}

function prikaziRezultat(){
    var container = document.getElementById("question");
    container.style.display = "none";
    var container2 = document.getElementById("rezultat");
    container2.style.display = "block";
    
    var procenat =
    
    imaBonus();
}



function izaberiNivo(clicked){
    var container = document.getElementById("level_choices");
    container.style.display = "none";
    var container2 = document.getElementById("question");
    container2.style.display = "block";
    var container3 = document.getElementById("rezultat");
    container3.style.display = "none";
    
    var str = clicked.id;
    var my_id = parseInt(str[str.length - 1]);
    izabranNivo = my_id;
    trenutniPredmet = (my_id - 1) * 3;
    bell_ring.play();
    zapocniNivo();
}


function setujPredmet(){
    var array = database[0].Pitanja;
    var pitanjaOblasti = [];
    switch (trenutniPredmet) {
        case 0:
            pitanjaOblasti = array.OpsteObrazovanje.Pitanje;
            break;
        case 1:
            pitanjaOblasti = array.SrpskiJezik.Pitanje;
            break;
        case 2:
            pitanjaOblasti = array.EngleskiJezik.Pitanje;
            break;
        case 3:
            pitanjaOblasti = array.Matematika.Pitanje;
            break;
        case 4:
            pitanjaOblasti = array.Informatika.Pitanje;
            break;
        case 5:
            pitanjaOblasti = array.Fizika.Pitanje;
            break;
        case 6:
            pitanjaOblasti = array.Biologija.Pitanje;
            break;
        case 7:
            pitanjaOblasti = array.Hemija.Pitanje;
            break;
        case 8:
            pitanjaOblasti = array.Geografija.Pitanje;
            break;
        case 9:
            pitanjaOblasti = array.Istorija.Pitanje;
            break;
        case 10:
            pitanjaOblasti = array.MuzickaKultura.Pitanje;
            break;
        case 11:
            pitanjaOblasti = array.LikovnaKultura.Pitanje;
            break;
        default:
            alert("ERR");
            break;
    }
    return pitanjaOblasti;
}

database = [
    {
      "Pitanja": {
        "OpsteObrazovanje": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Колико играча има у једном тиму за одбојку?",
              "PonudjeniOdgovori": {
                "Odgovor0": "7",
                "Odgovor1": "5",
                "Odgovor2": "6"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Врховни бог старих Грка је:",
              "PonudjeniOdgovori": {
                "Odgovor0": "Аполон",
                "Odgovor1": "Хермес",
                "Odgovor2": "Зевс"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Koлико континената постоји?",
              "PonudjeniOdgovori": {
                "Odgovor0": "6",
                "Odgovor1": "7",
                "Odgovor2": "8"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Која од наведених биљака нема корен у земљи?",
              "PonudjeniOdgovori": {
                "Odgovor0": "имела",
                "Odgovor1": "ружа",
                "Odgovor2": "кромпир"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Шта од наведеног не спада у воће?",
              "PonudjeniOdgovori": {
                "Odgovor0": "бресква",
                "Odgovor1": "лубеница",
                "Odgovor2": "нектарина"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Шта је Месец од наведеног?",
              "PonudjeniOdgovori": {
                "Odgovor0": "звезда",
                "Odgovor1": "планета",
                "Odgovor2": "сателит"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Која држава се назива \"Земљом лала\"",
              "PonudjeniOdgovori": {
                "Odgovor0": "Данска",
                "Odgovor1": "Италија",
                "Odgovor2": "Холандија"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Ко је написао књигу “Хари Потер”?",
              "PonudjeniOdgovori": {
                "Odgovor0": "J.K.Роулинг",
                "Odgovor1": "J.Р.Р.Толкин",
                "Odgovor2": "С.Кинг"
              },
              "IndeksTacnogOdgovora": "0"
            }
          ]
        },
        "LikovnaKultura": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Ко је насликао ремек-дело “Мона Лиза“?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Винсент ван Гог",
                "Odgovor1": "Пол Џексон Полок",
                "Odgovor2": "Леонардо да Винчи"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Познати музеј “Лувр“, који изгледа као стаклена пирамида, се налази у:",
              "PonudjeniOdgovori": {
                "Odgovor0": "Лондону",
                "Odgovor1": "Паризу",
                "Odgovor2": "Берлину"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Које су три примарне боје у адитивном простору боја?",
              "PonudjeniOdgovori": {
                "Odgovor0": "жута, магента и цијан",
                "Odgovor1": "црвена, плава и жута",
                "Odgovor2": "црвена, плава и зелена"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Шта приказује портрет?",
              "PonudjeniOdgovori": {
                "Odgovor0": "лик или и фигуру човека",
                "Odgovor1": "природу",
                "Odgovor2": "догађаје"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Која од понуђених није сликарска техника?",
              "PonudjeniOdgovori": {
                "Odgovor0": "акварел",
                "Odgovor1": "уље на платну",
                "Odgovor2": "креда"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Како се назива техника која се изводи слагањем разнобојних, мање или више правилних коцкица камена, обојеног стакла, глазиране керамике?",
              "PonudjeniOdgovori": {
                "Odgovor0": "темпера",
                "Odgovor1": "мозаик",
                "Odgovor2": "фреска"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Како се зову три стила грчких стубова?",
              "PonudjeniOdgovori": {
                "Odgovor0": "дорски, јонски и корински",
                "Odgovor1": "дорски, јонски и олимпски",
                "Odgovor2": "корински, атински и класични"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Ко је био најпознатији представник кубизма?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Клод Моне",
                "Odgovor1": "Жак-Луј Давид",
                "Odgovor2": "Пабло Руиз Пикасо"
              },
              "IndeksTacnogOdgovora": "2"
            }
          ]
        },
        "Biologija": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Ко је поставио теорију еволуције?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Роберт Хук",
                "Odgovor1": "Чарлс Дарвин",
                "Odgovor2": "Луј Пастер"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Који тип ћелија у организму нема једро?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Еритроцити",
                "Odgovor1": "Нервне ћелије",
                "Odgovor2": "Ћелије коже"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Који тип ћелија може да проводи акциони потенцијал?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Ћелије коже",
                "Odgovor1": "Крвне ћелије",
                "Odgovor2": "Неурони"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Ко је утврдио правила наслеђивања?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Луј Пастер",
                "Odgovor1": "Грегор Мендел",
                "Odgovor2": "Александар Флеминг"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Која органела има двоструку мембрану?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Нуклеус",
                "Odgovor1": "Лизозоми",
                "Odgovor2": "Голџијев апарат"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Који од наведених је назив за једну од три слушне кошчице?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Ушна шкољка",
                "Odgovor1": "Чекић",
                "Odgovor2": "Ексер"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Како се зове ћелијска течност без органела?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Цитоплазма",
                "Odgovor1": "Цитоликвор",
                "Odgovor2": "Цитосол"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Који од наведених одговора представља таксон?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Хијерархија",
                "Odgovor1": "Царство",
                "Odgovor2": "Краљевство"
              },
              "IndeksTacnogOdgovora": "1"
            }
          ]
        },
        "Informatika": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Шта ће бити испис позива функције print(\"Hello\", end=\"A\\n\") у Пајтон програмском језику?",
              "PonudjeniOdgovori": {
                "Odgovor0": "HelloA",
                "Odgovor1": "Hello end A",
                "Odgovor2": "HelloendA"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Која од наведених компоненти не представља рачунарску меморију?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Тврди диск",
                "Odgovor1": "ДДР5 РАМ",
                "Odgovor2": "Матична плоча"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Који од наведених није оперативни систем?",
              "PonudjeniOdgovori": {
                "Odgovor0": "ChromeOS",
                "Odgovor1": "Safari",
                "Odgovor2": "Linux"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Шта значи скраћеница PC",
              "PonudjeniOdgovori": {
                "Odgovor0": "Рачунар",
                "Odgovor1": "Микрорачунар",
                "Odgovor2": "Лични рачунар"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Који уређај има прикључак за слушалице?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Звучна картица",
                "Odgovor1": "Штампач",
                "Odgovor2": "Видео картица"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Шта је то кеш меморија?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Виртуелна меморија",
                "Odgovor1": "Брза меморија",
                "Odgovor2": "Меморија која служи за смештанје и компресију велике количине података"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Шта је то бит?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Најмања јединица за количину података",
                "Odgovor1": "Јединица за брзину рада процесора",
                "Odgovor2": "Ознака за јединицу информације која садржи 4 податка"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Колико битова садржи 1 бајт?",
              "PonudjeniOdgovori": {
                "Odgovor0": "1",
                "Odgovor1": "8",
                "Odgovor2": "16"
              },
              "IndeksTacnogOdgovora": "1"
            }
          ]
        },
        "SrpskiJezik": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Које од наведених су збирне именице?",
              "PonudjeniOdgovori": {
                "Odgovor0": "патике, сто, табела",
                "Odgovor1": "злато, сребро, вино",
                "Odgovor2": "лишће, цвеће, грмље"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Које речи имају исти род и број као и именица уз коју стоје?",
              "PonudjeniOdgovori": {
                "Odgovor0": "заменице",
                "Odgovor1": "придеви",
                "Odgovor2": "прилози"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Какви су бројеви: 90 160 34 и 654?",
              "PonudjeniOdgovori": {
                "Odgovor0": "основни",
                "Odgovor1": "редни",
                "Odgovor2": "збирни"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Која од наведених тврдњи је нетачна?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Постоје три модела управног говора",
                "Odgovor1": "Глаголи су речи које именују бића, предмете и појаве",
                "Odgovor2": "Реченице које се састоје од само субјеката и предиката зову се просте реченице"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Реченице по саставу могу бити",
              "PonudjeniOdgovori": {
                "Odgovor0": "просте, просто проширене и сложене",
                "Odgovor1": "потврдне и одричне",
                "Odgovor2": "обавештајне, упитне и узвичне"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Која реченица је правилно написана?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Читао сам \"Народну бајку Пепељуга\"",
                "Odgovor1": "Читао сам народну бајку \"Пепељуга\"",
                "Odgovor2": "Читао сам Народну бајку Пепељуга"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Шта означавају глаголи \"Смркава, свиће, грми\"?",
              "PonudjeniOdgovori": {
                "Odgovor0": "збивање",
                "Odgovor1": "радњу",
                "Odgovor2": "стање"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Који од наведених није падеж у српском језику?",
              "PonudjeniOdgovori": {
                "Odgovor0": "номинатив",
                "Odgovor1": "аблатив",
                "Odgovor2": "инструментал"
              },
              "IndeksTacnogOdgovora": "1"
            }
          ]
        },
        "EngleskiJezik": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Који од наведених одговора је најпожељнији одговор на питање \"How do you do?\"?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Very well! And you?",
                "Odgovor1": "What are you talking about?",
                "Odgovor2": "My name is Jake."
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Који од наведених времена није прошло време у енглеском језику?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Past perfect",
                "Odgovor1": "Past simple",
                "Odgovor2": "Present perfect"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Допуни: I can't find my keys. I don't know where ____ are.",
              "PonudjeniOdgovori": {
                "Odgovor0": "it",
                "Odgovor1": "them",
                "Odgovor2": "they"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Допуни: We ____ have friends over for dinner.",
              "PonudjeniOdgovori": {
                "Odgovor0": "often don't",
                "Odgovor1": "don't often",
                "Odgovor2": "don't never"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Допуни: That's ____. It's very expensive.",
              "PonudjeniOdgovori": {
                "Odgovor0": "Anna's car",
                "Odgovor1": "the car of Anna",
                "Odgovor2": "Anna car"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Допуни: When _____?",
              "PonudjeniOdgovori": {
                "Odgovor0": "did you arrived",
                "Odgovor1": "did you arrive",
                "Odgovor2": "were you arrived"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Допуни: He didn't speak English, _____ it was difficult to make him understand what he had to do.",
              "PonudjeniOdgovori": {
                "Odgovor0": "although",
                "Odgovor1": "because",
                "Odgovor2": "so"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Допуни: Tomorrow, I'll text you as soon as I ____.",
              "PonudjeniOdgovori": {
                "Odgovor0": "will wake up",
                "Odgovor1": "wake up",
                "Odgovor2": "'m waking up'"
              },
              "IndeksTacnogOdgovora": "1"
            }
          ]
        },
        "MuzickaKultura": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Ко је композитор \"Мале ноћне музике\"?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Волфганг Амадеус Моцарт",
                "Odgovor1": "Фридрих Шопен",
                "Odgovor2": "Антонио Вивалди"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Колико нота има у нотном систему?",
              "PonudjeniOdgovori": {
                "Odgovor0": "7",
                "Odgovor1": "12",
                "Odgovor2": "8"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Који кључ од наведених не постоји у музици?",
              "PonudjeniOdgovori": {
                "Odgovor0": "бас кључ",
                "Odgovor1": "тенорски кључ",
                "Odgovor2": "тонски кључ"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Који од наведених инструмената није дувачки?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Труба",
                "Odgovor1": "Виолончело",
                "Odgovor2": "Фагот"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Који од наведених инструмената је најмањи по величини?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Чело",
                "Odgovor1": "Виолина",
                "Odgovor2": "Виола"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Ко је композитор \"За Елизу\"?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Фридрих Шопен",
                "Odgovor1": "Антонио Вивалди",
                "Odgovor2": "Лудвиг ван Бетовен"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Који темпо представља \"Presto\"?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Брзо",
                "Odgovor1": "Радосно",
                "Odgovor2": "Умерено"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Који од наведених композитора није Италијан?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Винћенцо Белини",
                "Odgovor1": "Ђакомо Пучини",
                "Odgovor2": "Мануел де Фала"
              },
              "IndeksTacnogOdgovora": "2"
            }
          ]
        },
        "Fizika": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Како гласи Други Њутнов закон?",
              "PonudjeniOdgovori": {
                "Odgovor0": "F = m * a",
                "Odgovor1": "F = m / a",
                "Odgovor2": "m = F * a"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Брзина равномерно убрзаног праволинијског кретања изражава се једначином:",
              "PonudjeniOdgovori": {
                "Odgovor0": "v = v0 + a * t",
                "Odgovor1": "v = v0 - a * t",
                "Odgovor2": "v = v0 - g * t"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Која је јединица мере за момент силе?",
              "PonudjeniOdgovori": {
                "Odgovor0": "[N / m]",
                "Odgovor1": "[N]",
                "Odgovor2": "[N * m]"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "О чему говори Архимедов закон?",
              "PonudjeniOdgovori": {
                "Odgovor0": "О трењу",
                "Odgovor1": "О сили потиска",
                "Odgovor2": "О инерцији"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Густина тела се израчунава помоћу ког обрасца?",
              "PonudjeniOdgovori": {
                "Odgovor0": "ro = m / V",
                "Odgovor1": "ro = V / m",
                "Odgovor2": "ro = m * V"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Колико износи сила Земљине теже?",
              "PonudjeniOdgovori": {
                "Odgovor0": "9.81 [m / s^2]",
                "Odgovor1": "98.1 [m / s^2]",
                "Odgovor2": "10.81 [m / s^2]"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Запремина чврстог тела неправилног облика одређује се на који начин?",
              "PonudjeniOdgovori": {
                "Odgovor0": "коришћењем адекватног обрасца",
                "Odgovor1": "метром",
                "Odgovor2": "мензуром"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Која од понуђених физичких величина није основна?",
              "PonudjeniOdgovori": {
                "Odgovor0": "количина супстанце",
                "Odgovor1": "брзина",
                "Odgovor2": "време"
              },
              "IndeksTacnogOdgovora": "1"
            }
          ]
        },
        "Istorija": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Које године се одиграла Француска револуција?",
              "PonudjeniOdgovori": {
                "Odgovor0": "1789",
                "Odgovor1": "1798",
                "Odgovor2": "1790"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Којим догађајем је започео Други светски рат?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Нападом Немачке на Југославију",
                "Odgovor1": "Нападом Немачке на Пољску",
                "Odgovor2": "Француском револуцијом"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Како се звао најпознатији нацистички логор?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Мајданпек",
                "Odgovor1": "Аушвиц",
                "Odgovor2": "Белазет"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Које године се десио Велики раскол и подела хришћанства на католичанство и православље?",
              "PonudjeniOdgovori": {
                "Odgovor0": "1050.",
                "Odgovor1": "1004.",
                "Odgovor2": "1054."
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Ко је био први српски цар?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Стефан Урош III Дечански",
                "Odgovor1": "Стефан Урош V",
                "Odgovor2": "Стефан Душан"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Ко је убијен у Мајском преврату?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Александар и Драга Обреновић",
                "Odgovor1": "Стефан и Дејана Обреновић",
                "Odgovor2": "Стефан и Драга Обреновић"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Којим догађајем је започео Средњи век?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Падом Источног римског царства",
                "Odgovor1": "Падом Западног римског царства",
                "Odgovor2": "Падом Византијског царства"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "У ком граду је потписан први срспки устав?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Београду",
                "Odgovor1": "Крагујевцу",
                "Odgovor2": "Новом Саду"
              },
              "IndeksTacnogOdgovora": "1"
            }
          ]
        },
        "Hemija": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Који је хемијски симбол за манган?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Mn",
                "Odgovor1": "Mg",
                "Odgovor2": "Ga"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Једна од наведених тврдњи није тачна. Која је то?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Хелијум у балону је елемент",
                "Odgovor1": "Жива у топломеру је елемент",
                "Odgovor2": "Вода са чесме је једињење"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Колико приближно износи вредност Авогадровог броја?",
              "PonudjeniOdgovori": {
                "Odgovor0": "6 * 10^25",
                "Odgovor1": "6 * 10^24",
                "Odgovor2": "6 * 10^23"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Који од наведених елемената је синтетички?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Th",
                "Odgovor1": "Br",
                "Odgovor2": "Zn"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Колико електрона се могу сместити у првом s поднивоу?",
              "PonudjeniOdgovori": {
                "Odgovor0": "1",
                "Odgovor1": "2",
                "Odgovor2": "3"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "На који начин можемо дефинисати оксидацију?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Оксидација је добитак електрона",
                "Odgovor1": "Оксидација је губитак електрона",
                "Odgovor2": "Оксидација је задржавање електрона"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Који елемент од наведених је најреактивнији?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Калијум",
                "Odgovor1": "Злато",
                "Odgovor2": "Сребро"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Која је молекулска формула за глукозу?",
              "PonudjeniOdgovori": {
                "Odgovor0": "C12H6O12",
                "Odgovor1": "C16H22O10",
                "Odgovor2": "C6H12O6"
              },
              "IndeksTacnogOdgovora": "2"
            }
          ]
        },
        "Geografija": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Које од ових земаља немају само једну границу?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Северна Кореја",
                "Odgovor1": "Португалија",
                "Odgovor2": "Ирска"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Које од ових планинских венаца се не налазе у Европи?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Пиринеји",
                "Odgovor1": "Карпати",
                "Odgovor2": "Атлас"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Које од ових градова није главни град?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Каиро",
                "Odgovor1": "Сиднеј",
                "Odgovor2": "Праг"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Које од ових земаља немају само једну границу?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Северна Кореја",
                "Odgovor1": "Португалија",
                "Odgovor2": "Ирска"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Koja врста стене не спада у седиментне?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Органогене",
                "Odgovor1": "Хемијске",
                "Odgovor2": "Дубинске магматске"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Која је најдужа река на планети Земљи?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Амазон",
                "Odgovor1": "Нил",
                "Odgovor2": "Јанцекјанг"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Која природна појава је одговорна за еолску ерозију?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Поплава",
                "Odgovor1": "Ветар",
                "Odgovor2": "Земљотрес"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Kojа држава је са излазом на Јадранско море?",
              "PonudjeniOdgovori": {
                "Odgovor0": "Словенија",
                "Odgovor1": "Малта",
                "Odgovor2": "Грчка"
              },
              "IndeksTacnogOdgovora": "0"
            }
          ]
        },
        "Matematika": {
          "Pitanje": [
            {
              "IndeksPitanja": "0",
              "TekstPitanja": "Колика је дужина дијагонале квадрата странице a?",
              "PonudjeniOdgovori": {
                "Odgovor0": "a * sqrt(a)",
                "Odgovor1": "a * sqrt(2)",
                "Odgovor2": "sqrt(a)"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "1",
              "TekstPitanja": "Колико износи (5!) ?",
              "PonudjeniOdgovori": {
                "Odgovor0": "125",
                "Odgovor1": "120",
                "Odgovor2": "150"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "2",
              "TekstPitanja": "Колико износи сума првих n природних непарних бројева?",
              "PonudjeniOdgovori": {
                "Odgovor0": "n²",
                "Odgovor1": "(2n-1)²",
                "Odgovor2": "n³"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "3",
              "TekstPitanja": "Са којом геометријском сликом је Питагорина теорема у вези?",
              "PonudjeniOdgovori": {
                "Odgovor0": "кружницом",
                "Odgovor1": "елипсом",
                "Odgovor2": "правоуглим троуглом"
              },
              "IndeksTacnogOdgovora": "2"
            },
            {
              "IndeksPitanja": "4",
              "TekstPitanja": "Колико износи квадратни корен броја 0.0081?",
              "PonudjeniOdgovori": {
                "Odgovor0": "0.09",
                "Odgovor1": "0.9",
                "Odgovor2": "0.009"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "5",
              "TekstPitanja": "Који од наведених бројева даје 240 када се дода свом квадрату?",
              "PonudjeniOdgovori": {
                "Odgovor0": "15",
                "Odgovor1": "20",
                "Odgovor2": "18"
              },
              "IndeksTacnogOdgovora": "0"
            },
            {
              "IndeksPitanja": "6",
              "TekstPitanja": "Колико износи збир свих унутрашњих углова петоугла?",
              "PonudjeniOdgovori": {
                "Odgovor0": "720",
                "Odgovor1": "900",
                "Odgovor2": "810"
              },
              "IndeksTacnogOdgovora": "1"
            },
            {
              "IndeksPitanja": "7",
              "TekstPitanja": "Који од наведених бројева је квадрат простог броја?",
              "PonudjeniOdgovori": {
                "Odgovor0": "144",
                "Odgovor1": "169",
                "Odgovor2": "196"
              },
              "IndeksTacnogOdgovora": "1"
            }
          ]
        }
      }
    }
]