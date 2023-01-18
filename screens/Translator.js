import { dictionary } from "../dictionary"

export const Translator = (source, lang) => {

    if (source in dictionary) {
        if (lang in dictionary[source]) {
            return dictionary[source][lang]
        }
        else {
            console.warn("No translation found for " + source + " in " + lang)
            return source
        }
    }
    else {
        console.warn("No translation found for " + source)
        return source
    }
}