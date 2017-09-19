function decodeHTML(s, sample) {
    if (!s){
        return sample;
    }
    return decodeURIComponent(s);
}