


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

pub fn normalize_name(t_name: &str) -> String {
    let lowercased = t_name.trim().to_lowercase().replace(" ", "_");
    let mut chars = lowercased.chars();
    let first_char = chars.next().unwrap_or('X').to_uppercase();
    let remaining_chars: String = if lowercased.len() >= 2 {
        chars.collect::<Vec<char>>().into_iter().collect::<String>()
    } else {
        "".to_string()
    };
    let result = format!("{0}{1}", first_char, remaining_chars);

    result
}