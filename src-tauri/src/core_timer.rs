// use std::time::{Instant};
// use std::convert::TryFrom;
use tokio::time::{interval, Duration, Instant, MissedTickBehavior};
use crate::store_timer::{Action, SELECTORS, StoreType};



fn __set_timer() -> (Instant, u16) {
    let start_time = Instant::now();
    let tick = 0;

    (start_time, tick)
}


pub async fn _toggle_timer_state(store: &StoreType) {
    let is_running = store.select(SELECTORS::IsRunning).await;
    if is_running {
        println!("STOP timer");
        store.dispatch(Action::Stop("".into())).await;
    } else {
        println!("RUN timer");
        store.dispatch(Action::Start("".into())).await;
    };
}

pub async fn run_timer(store: &StoreType, tick_val_sec: u16) {
    let target_delay = Duration::from_secs(tick_val_sec.into());
    let idle_delay = Duration::from_millis(100);

    let mut ticker = interval(target_delay);
    ticker.set_missed_tick_behavior(MissedTickBehavior::Skip);

    // let (mut start_time, mut tick) = __set_timer();
    let mut towake = true;

    loop {
        if store.select(SELECTORS::__GetResetTimerFlag).await == true {
            // ticker.reset_immediately();
            // ticker.tick().await;
            towake = true;
            store.dispatch(Action::__UpdResetTimerFlag(false)).await;
        }
        if store.select(SELECTORS::IsRunning).await == false {
            if !towake { towake = true };
            tokio::time::sleep(idle_delay).await;
            continue;
        } else {
            if towake {
                towake = false;
                ticker.reset_immediately();
                tokio::time::sleep(target_delay / 5).await;
                ticker.reset_immediately();
                ticker.tick().await;
            }
            store.dispatch(Action::Tick(tick_val_sec as i32)).await;
            ticker.tick().await;
        }
    }
}
