import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Bluetooth, Wifi, Usb, Send } from "lucide-react";
import conversationsData from "../data/conversations.json";
import { NODES, CONNECTIONS, getFloodWaves } from "../utils/meshTopology";
import "./MeshTopology.css";

const DEVICE_IMAGE_BASE = "https://flasher.meshtastic.org/img/devices/";
const PHONE_NODE = 6;
const USB_NODE = 5;
const WAVE_MS = 1100;
type Message = { id: number; text: string; sender: number };
type Edge = { index: number; from: number; to: number };

export function MeshTopology() {
  const id = useId();
  const [ready, setReady] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [edges, setEdges] = useState<Edge[]>([]);
  const [heard, setHeard] = useState<number[]>([]);
  const [phone, setPhone] = useState<Message[]>([]);
  const [terminal, setTerminal] = useState<Message[]>([]);
  const [connection, setConnection] = useState<"sending" | "receiving" | null>(null);
  const [status, setStatus] = useState("Send a simulated message or play the demo.");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);
  const sequence = useRef(0);
  const cannedIndex = useRef(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    setReady(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => { if (media.matches) setAutoPlay(false); };
    // Keep the simulation still until the reader opts in.
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      clearTimers();
      running.current = false;
    };
  }, [clearTimers]);

  const startMessage = useCallback((sender: number, text: string) => {
    if (running.current) return;
    clearTimers();
    running.current = true;
    setBusy(true);
    setEdges([]);
    setHeard([sender]);
    const message = { id: ++sequence.current, text, sender };
    const schedule = (callback: () => void, delay: number) => {
      timers.current.push(setTimeout(callback, delay));
    };
    const deliver = (node: number) => {
      if (node === PHONE_NODE) {
        setPhone((previous) => [...previous.slice(-4), message]);
        setConnection("receiving");
        schedule(() => setConnection(null), 600);
      }
      if (node === USB_NODE) setTerminal((previous) => [...previous.slice(-4), message]);
    };
    if (sender === PHONE_NODE) {
      setPhone((previous) => [...previous.slice(-4), message]);
      setConnection("sending");
      schedule(() => setConnection(null), 600);
    } else deliver(sender); // A computer also receives a message originating at its own radio.
    setStatus(`Node ${sender} is sending a message.`);
    const waves = getFloodWaves(sender);
    const firstWave = sender === PHONE_NODE ? 650 : 0;
    waves.forEach((wave, index) => {
      schedule(() => {
        setEdges(wave.edges);
        setStatus(`Radio hop ${index + 1}: reaching ${wave.receivers.length} more nodes.`);
      }, firstWave + index * WAVE_MS);
      schedule(() => {
        setHeard((previous) => [...previous, ...wave.receivers]);
        wave.receivers.forEach(deliver);
      }, firstWave + (index + 1) * WAVE_MS - 200);
    });
    schedule(() => {
      setEdges([]);
      setConnection(null);
      setStatus("Message delivered across the simulated mesh.");
      running.current = false;
      setBusy(false);
      timers.current = [];
    }, firstWave + waves.length * WAVE_MS + 500);
  }, [clearTimers]);

  useEffect(() => {
    if (!autoPlay || busy) return;
    const timer = setTimeout(() => {
      const clients = NODES.filter((node) => node.label === "Client" && node.id !== PHONE_NODE);
      const index = cannedIndex.current++;
      startMessage(clients[index % clients.length].id,
        conversationsData.standaloneMessages[index % conversationsData.standaloneMessages.length]);
    }, 1500);
    return () => clearTimeout(timer);
  }, [autoPlay, busy, startMessage]);

  const stopDemo = () => {
    setAutoPlay(false);
    clearTimers();
    running.current = false;
    setBusy(false);
    setEdges([]);
    setConnection(null);
    setStatus("Demo stopped. Send a message or play again.");
  };

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || running.current) return;
    setAutoPlay(false);
    startMessage(PHONE_NODE, input.trim());
    setInput("");
  };

  return (
    <section className="mesh-demo" aria-label="Interactive mesh network demonstration">
      <div className="mesh-demo-toolbar">
        <strong>Try the mesh</strong>
        <button type="button" disabled={!ready || (busy && !autoPlay)}
          onClick={() => autoPlay ? stopDemo() : setAutoPlay(true)}>
          {autoPlay ? "Stop demo" : "Play demo"}
        </button>
      </div>
      <p className="mesh-demo-note">A simplified simulation of message relaying. These messages stay in your browser.</p>
      <div className="mesh-demo-map">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {CONNECTIONS.map(([from, to], index) => {
            const active = edges.find((edge) => edge.index === index);
            return <g key={index}>
              <line x1={NODES[from].x} y1={NODES[from].y} x2={NODES[to].x} y2={NODES[to].y}
                className={active ? "mesh-link active" : "mesh-link"} />
              {active && <circle key={`${sequence.current}-${active.from}`} r="1" className="mesh-packet">
                <animate attributeName="cx" from={NODES[active.from].x} to={NODES[active.to].x} dur="0.9s" fill="freeze" />
                <animate attributeName="cy" from={NODES[active.from].y} to={NODES[active.to].y} dur="0.9s" fill="freeze" />
              </circle>}
            </g>;
          })}
        </svg>
        {NODES.map((node) => <div key={node.id} className={`mesh-device${heard.includes(node.id) ? " heard" : ""}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}>
          <img src={`${DEVICE_IMAGE_BASE}${node.device}`} alt="" width="40" height="46" loading="lazy"
            onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
          <span>Node {node.id}</span><small>{node.label}</small>
          {node.id === PHONE_NODE && <Bluetooth size={14} aria-label="Bluetooth to phone" />}
          {node.id === USB_NODE && <Usb size={14} aria-label="USB to computer" />}
          {node.id === 3 && <Wifi size={14} aria-label="WiFi available" />}
        </div>)}
      </div>
      <p className="mesh-demo-status" role="status">{status}</p>
      <div className="mesh-demo-clients">
        <div className="mesh-phone">
          <strong><Bluetooth size={16} /> Your phone · Node 6</strong>
          <span className="mesh-connection">{connection === "sending" ? "Sending via Bluetooth…" : connection === "receiving" ? "Receiving via Bluetooth…" : "Bluetooth connected"}</span>
          <div className="mesh-messages" role="log" aria-label="Phone messages" aria-live="off">
            {!phone.length && <p>No messages yet.</p>}
            {phone.map((message) => <p key={message.id} className={message.sender === PHONE_NODE ? "sent" : "received"}>
              <small>{message.sender === PHONE_NODE ? "You" : `Node ${message.sender}`}</small>{message.text}
            </p>)}
          </div>
          <form onSubmit={send}>
            <label htmlFor={`${id}-message`}>Message to the mesh</label>
            <div className="mesh-compose">
              <input id={`${id}-message`} value={input} onChange={(event) => setInput(event.target.value)}
                placeholder="Hello mesh!" maxLength={200} disabled={!ready} />
              <button type="submit" disabled={!ready || busy || !input.trim()} aria-label="Send message"><Send size={18} /></button>
            </div>
          </form>
        </div>
        <div className="mesh-terminal">
          <strong><Usb size={16} /> Computer · Node 5</strong>
          <div className="mesh-messages" role="log" aria-label="Computer messages" aria-live="off">
            <p>$ meshtastic --listen</p>
            {!terminal.length && <p>Listening for messages…</p>}
            {terminal.map((message) => <p key={message.id}>[Node {message.sender}]: {message.text}</p>)}
          </div>
        </div>
      </div>
      <p className="mesh-demo-note">Lines show possible LoRa links. Highlighted nodes have received the current message; Bluetooth and USB connect the radios to your devices.</p>
    </section>
  );
}

export default MeshTopology;
