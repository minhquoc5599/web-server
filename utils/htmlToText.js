export const htmlToText = (html) => {
    let text = html;
    text = text.replace(/<[^>]*>/g, '');
    text = text.replace(/\s*$/,"");
    return text;
};

