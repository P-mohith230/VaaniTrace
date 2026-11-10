"""Generate sample audio and test transcripts for VaaniTrace demonstration."""

import os
import wave
import struct
import math
import json
from pathlib import Path


def create_sample_wav(filepath: Path, duration_sec: float = 3.0, sample_rate: int = 16000, freq: float = 440.0):
    """Generate a clean synthetic sine wave PCM audio WAV file."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    num_samples = int(duration_sec * sample_rate)

    with wave.open(str(filepath), 'wb') as wav_file:
        wav_file.setnchannels(1)      # Mono
        wav_file.setsampwidth(2)      # 16-bit
        wav_file.setframerate(sample_rate)

        # Generate smooth harmonic audio samples (simulating spoken voice carrier)
        raw_data = bytearray()
        for i in range(num_samples):
            t = float(i) / sample_rate
            # Modulation simulating conversational speech cadence
            modulation = 0.5 * (1.0 + math.sin(2.0 * math.pi * 3.0 * t))
            sample_val = int(32767.0 * 0.3 * modulation * math.sin(2.0 * math.pi * freq * t))
            raw_data.extend(struct.pack('<h', sample_val))

        wav_file.writeframes(raw_data)
    print(f"Created sample audio: {filepath} ({filepath.stat().st_size} bytes)")


def main():
    samples_dir = Path("data") / "samples"
    samples_dir.mkdir(parents=True, exist_ok=True)

    # 1. Generate sample WAV files
    create_sample_wav(samples_dir / "sample_business_order.wav", duration_sec=4.0, freq=280.0)
    create_sample_wav(samples_dir / "sample_meeting_actions.wav", duration_sec=3.5, freq=320.0)
    create_sample_wav(samples_dir / "sample_field_inspection.wav", duration_sec=3.0, freq=240.0)
    create_sample_wav(samples_dir / "sample_customer_complaint.wav", duration_sec=4.5, freq=300.0)

    # 2. Generate structured demo transcripts clearly marked as sample data
    sample_transcripts = {
        "business_order": {
            "title": "B2B Medical Wholesale Order",
            "language": "en-IN",
            "record_type": "business_order",
            "transcript": "Hello Rajesh, this is Suresh speaking. I need 20 boxes of surgical gloves at 1200 rupees each. Please deliver them by Friday to our central warehouse.",
            "description": "Wholesale surgical equipment purchase order with quantity, unit price, calculated total, and delivery deadline."
        },
        "meeting_action_items": {
            "title": "Weekly Product Engineering Sync",
            "language": "en-IN",
            "record_type": "meeting_action_items",
            "transcript": "In today's sync, Priya will prepare the slide deck by Friday. Rahul to review the client contract. Ankit will deploy the security patch before EOD.",
            "description": "Team project review with task assignments and hard deadlines."
        },
        "field_report": {
            "title": "Site Inspection - Sector 4 Solar Facility",
            "language": "en-IN",
            "record_type": "field_report",
            "transcript": "Site inspection at Warehouse 4 completed. We identified a critical water leakage in the northern corridor near Inverter B. Immediate repair is required.",
            "description": "Field debrief reporting equipment condition and required follow-up."
        },
        "customer_complaint": {
            "title": "Enterprise Fiber Outage Grievance",
            "language": "en-IN",
            "record_type": "customer_complaint",
            "transcript": "This is urgent! My broadband service has been disconnected since yesterday and no one is responding to my tickets. We are losing business operations.",
            "description": "High-urgency customer grievance regarding connectivity outage."
        },
        "hindi_business_order": {
            "title": "हिंदी व्यापार आदेश (Hindi Wholesale Order)",
            "language": "hi-IN",
            "record_type": "business_order",
            "transcript": "नमस्ते रमेश भाई। मुझे 50 कार्टन आम चाहिए। 600 रुपये प्रति कार्टन का भाव तय हुआ था। कल शाम तक दुकान पर भेज देना।",
            "description": "Hindi wholesale order for mangoes with unit price and delivery deadline."
        }
    }

    metadata_path = samples_dir / "sample_transcripts.json"
    metadata_path.write_text(json.dumps(sample_transcripts, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Created sample transcript metadata: {metadata_path}")


if __name__ == "__main__":
    main()

