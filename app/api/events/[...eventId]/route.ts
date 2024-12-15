import dbConnect from '../../../../lib/connectDb';
import { EventModel } from '../../../../model/User';

export async function GET(
    req: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        await dbConnect();

        const { eventId } =  await params;

        if (!params.eventId) {
            return new Response(
                JSON.stringify({ success: false, message: 'Event ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const event = await EventModel.findById(eventId)
            .populate('eventHostedBy', 'name')
            .populate('interestedMembersArr', 'name');
        if (!event) {
            return new Response(
                JSON.stringify({ success: false, message: 'Event not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return new Response(
            JSON.stringify({ success: true, data: event }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching event:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Server error', error: (error as any).message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
