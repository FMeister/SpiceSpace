import PairingTag from "./PairingTag";

class PairingTagSynonyms {
  synonyms = {
  "Gemüse":[],
  "Pilze":[],
  "Reis":[],
  "Hülsenfrüchte":[],
  "Linsen":[],
  "Milchprodukte":[PairingTag.Käse,PairingTag.Weichkäse,PairingTag.Frischkäse,PairingTag.Hüttenkäse,PairingTag.Ziegenkäse,PairingTag.Joghurt,PairingTag.Sahne,PairingTag.Butter,PairingTag.Parmesan,PairingTag.Ricotta],
  "Hühnchen":[],
  "Tomaten":[],
  "Steinfrüchte":[PairingTag.Kirschen,PairingTag.Pflaumen,PairingTag.Pfirsiche,PairingTag.Aprikosen],
  "Äpfel":[],
  "Feigen":[],
  "Dunkle Schokolade":[PairingTag.Schokolade],
  "Brühe":[],
  "Zwiebelsuppe":[PairingTag.Zwiebeln],
  "Fischpastete":[],
  "Ragù":[],
  "Pfirsiche":[],
  "Pflaumen":[],
  "Zitronenschale":[PairingTag.Zitrone],
  "Eier":[],
  "Butter":[],
  "Lamm":[],
  "Fisch":[PairingTag.Lachs,PairingTag.Schalentiere,PairingTag.Thunfisch,PairingTag.Muscheln,PairingTag.Tintenfisch,PairingTag.Fischpastete,PairingTag.Garnelen,PairingTag.Oktopus],
  "Meeresfrüchte":[],
  "Zitrusfrüchte":[],
  "Fladenbrot":[],
  "Curry":[],
  "Rührei":[],
  "Grüne Papaya":[],
  "Pomelo":[],
  "Kürbis":[],
  "Kartoffeln":[],
  "Rote Beete":[],
  "Kohl":[PairingTag.Rotkohl,PairingTag.Weißkohl,PairingTag.Chinakohl,PairingTag.Rosenkohl,PairingTag.Kohlgemüse],
  "Artischocken":[],
  "Wurzelgemüse":[PairingTag.Karotten,"Möhren"],
  "Ingwer":[],
  "Oliven":[],
  "Salbei":[],
  "Käse":[],
  "Wildfleisch":[],
  "Ente":[],
  "Hase":[],
  "Gans":[],
  "Wachteln":[],
  "Schwarze Johannisbeeren":[],
  "Getrocknete Früchte":[],
  "Lachs":[],
  "Kaninchen":[],
  "Makrele":[],
  "Tiramisu":[],
  "Bambussprossen":[],
  "Lotuswurzel":[],
  "Nudeln":[PairingTag.Dan_Dan_Nudeln],
  "Schwein":[],
  "Rind":[],
  "Kokosnuss":[PairingTag.Kokosnusscreme],
  "Tropische Früchte":[],
  "Muscheln":[],
  "Schalotten":[],
  "Knoblauch":[],
  "Chili":[],
  "Galgant":[],
  "Kokosnusscreme":[PairingTag.Kokosnuss],
  "Thai-Basilikum":[],
  "Garnelen":[],
  "Kebab":[],
  "Koriander":[],
  "Karotten":["Möhren"],
  "Paprika":[],
  "Gurke":[],
  "Melone":[],
  "Beeren":[],
  "Mandeln":[],
  "Kaffee":[],
  "Pistazien":[],
  "Rettich":[],
  "Himbeeren":[],
  "Whiskey":[],
  "Zimt":[],
  "Limette":[],
  "Honig":[],
  "Kümmel":[],
  "Couscous":[],
  "Datteln":[],
  "Ochsenschwanz":[],
  "Rhabarbar":[],
  "Birne":[],
  "Pho":[],
  "Fünf_Gewürz_Pulver":[],
  "Biryani":[],
  "Garam Masala":[],
  "Schwarzerkümmel":[],
  "Bohnensprossen":[],
  "Schweinebauch":[],
  "Sesam":[],
  "Vanille":[],
  "Blumenkohl":[],
  "Aubergine":[],
  "Okra":[],
  "Schalentiere":[],
  "Pakoras":[],
  "Samosas":[],
  "Mango":[],
  "Koriandersamen":[],
  "Curryblätter":[],
  "Senf":[],
  "Zitronengras":[],
  "Brokkoli":[],
  "Spinat":[],
  "Kichererbsen":[],
  "Avocado":[],
  "Walnüsse":[],
  "Kreuzkümmel":[],
  "Granatapfel":[],
  "Orange":[PairingTag.Orangenblüten],
  "Blattgemüse":[],
  "Staudensellerie":[PairingTag.Knollensellerie],
  "Fenchel":[],
  "Grüne Bohnen":[],
  "Lavendel":[],
  "Blutwurst":[],
  "Thunfisch":[],
  "Glühwein":[],
  "Gin":[PairingTag.Gin_Tonic],
  "Dal":[PairingTag.Linsen],
  "Jalapeños":[PairingTag.Chili],
  "Minze":[],
  "Oktopus":[],
  "Tintenfisch":[],
  "Rose":[],
  "Nüsse":[],
  "Dill":[],
  "Cayennepfeffer":[],
  "Safran":[],
  "Weiße Bohnen":[],
  "Erdnüsse":[],
  "Tofu":[],
  "Fleisch":[PairingTag.Wildfleisch,PairingTag.Schwein,PairingTag.Schweinebauch,PairingTag.Rind,PairingTag.Hühnchen,PairingTag.Ochsenschwanz,PairingTag.Wachteln,PairingTag.Kaninchen,PairingTag.Blutwurst,PairingTag.Kalb,PairingTag.Lamm,PairingTag.Kebab],
  "Dan-Dan-Nudeln":[],
  "Gin & Tonic":[PairingTag.Gin],
  "Süßkartoffeln":[],
  "Pak Choi":[],
  "Litschi":[],
  "Orangenblüten":[PairingTag.Orange],
  "Gnocchi":[],
  "Chinakohl":[],
  "Joghurt":[],
  "Feta":[],
  "Rotweinessig":[],
  "Mais":[],
  "Tahini":[],
  "Ananas":[],
  "Bulgar":[],
  "Zwiebeln":[],
  "Kohlgemüse":[PairingTag.Kohl,PairingTag.Rotkohl,PairingTag.Weißkohl,PairingTag.Chinakohl,PairingTag.Rosenkohl],
  "Erbsen":[],
  "Speck":[],
  "Karamell":[],
  "Thymian":[],
  "Sahne":[],
  "Bananen":[],
  "Erdbeeren":[],
  "Ziegenkäse":[],
  "Kirschen":[],
  "Weißkohl":[],
  "Weichkäse":[],
  "Shortbread":[],
  "Sauerkraut":[],
  "Harissa":[],
  "Haselnüsse":[],
  "Krautsalat":[],
  "Zucchini":[],
  "Aprikosen":[],
  "Falafel":[],
  "Spargel":[],
  "Hüttenkäse":[],
  "Weißweinessig":[],
  "Zitrone":[PairingTag.Zitronenschale],
  "Kalb":[],
  "Gratins":[],
  "Parmesan":[],
  "Ricotta":[],
  "Schokolade":[PairingTag.Weiße_Schokolade,PairingTag.Dunkle_Schokolade,PairingTag.Kakao],
  "Lauch":[],
  "Weiße Schokolade":[PairingTag.Schokolade],
  "Sardinen":[],
  "Pinienkerne":[],
  "Rosinen":[],
  "Sojasauce":[],
  "Reisessig":[],
  "Weißwein":[],
  "Rotwein":[],
  "Bockshornklee":[],
  "Petersilie":[],
  "Estragon":[],
  "Haferflocken":[],
  "Mangold":[],
  "Cashewnüsse":[],
  "Rosenblätter":[],
  "Rosenkohl":[],
  "Rosmarin":[],
  "Passionsfrucht":[],
  "Grüner Kardamom":[],
  "Innereien":[],
  "Maniok":[],
  "Frischkäse":[],
  "Kimchi":[],
  "Liebstöckel":[],
  "Trauben":[],
  "Schwarzer Pfeffer":[],
  "Langer Pfeffer":[],
  "Grapefruit":[],
  "Nelken":[],
  "Paella":[],
  "Gulasch":[],
  "Lorbeer":[],
  "Zuckererbsen":[],
  "Buchweizen":[],
  "Trüffel":[],
  "Bärlauch":[],
  "Tonkabohnen":[],
  "Mozzarella":[],
  "Kurkuma":[],
  "Chicoree":[],
  "Risotto":[],
  "Knollensellerie":[PairingTag.Staudensellerie],
  "Rotkohl":[],
  "Rum":[],
  "Schinken":[],
  "Pastinaken":[],
  "Rucola":[],
  "Tamarinde":[],
  "Papadam":[],
  "Bohnen":["Kidneybohnen",PairingTag.Weiße_Bohnen,PairingTag.Grüne_Bohnen],
  "Basilikum":[],
  "Papaya":[],
  "Gebäck":[],
  "Muskatnuss":[],
  "Piment":[],
  "Pfeffer":[PairingTag.Langer_Pfeffer,PairingTag.Schwarzer_Pfeffer,PairingTag.Cayennepfeffer],
  "Kakao":[PairingTag.Weiße_Schokolade,PairingTag.Dunkle_Schokolade,PairingTag.Kakao],
  };
}

export default PairingTagSynonyms;
