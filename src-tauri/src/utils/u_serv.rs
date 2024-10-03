

pub mod cli_output_format {
    pub const GREEN : &str = "\x1B[32m";
    pub const RED   : &str = "\x1B[31m";
    pub const YELLOW: &str = "\x1B[33m";
    pub const BOLD  : &str = "\x1B[1m";
    pub const RESET : &str = "\x1B[0m";
}

use cli_output_format::{
    RESET, BOLD, YELLOW
};



pub fn prompt_to(sys_msg: &str, msg: &str) -> bool {
    println!("{BOLD}{YELLOW}{msg}\n{sys_msg}{RESET}\n");
    let mut input = String::new();
    std::io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    input.trim().is_empty()
}

pub fn prompt_to_exit(msg: &str) {
    let sys_msg = "Press 'enter' to exit...";
    prompt_to(sys_msg, msg);
}

pub fn prompt_to_continue(msg: &str) -> bool {
    let sys_msg = "Press 'enter' to continue...";
    prompt_to(sys_msg, msg)
}



pub fn abs_max(f_prev: f64, f_new: f64) -> f64 {
    f_prev.abs().max(f_new.abs())
}



pub fn remove_symbols(input: &str, symbols: &str) -> String {
    input.chars().filter(|c| !symbols.contains(*c)).collect()
}



fn capitalize_word(input: impl AsRef<str>) -> String {
    let mut chars = input.as_ref().chars();
    chars.next().map(|first| first
        .to_uppercase()
        .chain(chars.flat_map(char::to_lowercase))
    )
    .into_iter()
    .flatten()
    .collect()
}


pub fn normalize_name(input_name: impl AsRef<str>) -> String {
    const MAX_NAME_LENGTH: usize = 30;
    const TO_REPLACE: &str = "_.";
    const SEPARATOR: char = ' ';

    let result = input_name.as_ref().chars()
        .map(|c| if TO_REPLACE.contains(c) { SEPARATOR } else { c })
        .flat_map(char::to_lowercase)
        .take(MAX_NAME_LENGTH)
        .collect::<String>()
        .split_whitespace()
        .map(capitalize_word)
        .collect::<Vec<String>>()
        .join(&SEPARATOR.to_string());

    result
}



#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_normalize_name() {
        assert_eq!(normalize_name(" __дДДД__ДДД   ..ддд___ jjj  1jjjj   "), "Дддд Ддд Ддд Jjj 1");
    }
}
