import yaml from 'js-yaml';

export function fetchAndParseYaml<T = any>(url: string): Promise<T> {
  return fetch(url)
    .then((response) => response.text())
    .then((text) => yaml.load(text) as T);
}
